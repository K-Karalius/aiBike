// services/rideService.ts
import * as Location from 'expo-location';
import { getBike, updateBike } from '@/apis/bikeApis';
import {
  startRide as startRideApi,
  endRide as endRideApi,
  getRide,
  getCurrentRide,
} from '@/apis/rideApis';
import { getStation, getStationsInRange } from '@/apis/stationApis';
import { Bike } from '@/interfaces/bike';
import {
  CreateRideRequest,
  EndRideRequest,
  Ride,
  RideStatus,
} from '@/interfaces/ride';
import { Station, GetStationsRequest } from '@/interfaces/station';

// --- Configuration ---
const PROXIMITY_THRESHOLD_METERS = 100; // 100 meters proximity threshold
const RIDE_LOCATION_UPDATE_INTERVAL_MS = 30000; // 30 seconds

// --- Interfaces (if not already in ride.ts) ---
export interface UpdateRideLocationRequest {
  latitude: number;
  longitude: number;
}

// --- Helper Functions ---

/**
 * Converts degrees to radians.
 * @param deg Degrees.
 * @returns Radians.
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Calculates the distance between two geographic coordinates using the Haversine formula.
 * @param lat1 Latitude of the first point.
 * @param lon1 Longitude of the first point.
 * @param lat2 Latitude of the second point.
 * @param lon2 Longitude of the second point.
 * @returns Distance in meters.
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c; // Distance in km
  return distanceKm * 1000; // Distance in meters
}

/**
 * Gets the current user's location.
 * @returns A promise that resolves to the user's location coordinates.
 * @throws Error if permission is denied or location cannot be fetched.
 */
export async function getCurrentUserLocation(): Promise<Location.LocationObjectCoords> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied.');
  }
  const location = await Location.getCurrentPositionAsync({});
  return location.coords;
}

// --- Proximity Checks ---

/**
 * Checks if the user is within a specified proximity to a bike and its station.
 * @param userCoords User's current coordinates.
 * @param bike The bike object.
 * @param station The station object where the bike is located.
 * @returns True if within proximity, false otherwise.
 */
async function checkProximityToBikeAndStation(
  userCoords: Location.LocationObjectCoords,
  bike: Bike,
  station: Station,
): Promise<boolean> {
  const distanceToBike = calculateDistance(
    userCoords.latitude,
    userCoords.longitude,
    bike.latitude,
    bike.longitude,
  );
  const distanceToStation = calculateDistance(
    userCoords.latitude,
    userCoords.longitude,
    station.latitude,
    station.longitude,
  );

  if (distanceToBike > PROXIMITY_THRESHOLD_METERS) {
    throw new Error(
      `You must be closer to the bike to start the ride (current: ${distanceToBike.toFixed(0)}m, required: ${PROXIMITY_THRESHOLD_METERS}m).`,
    );
  }
  if (distanceToStation > PROXIMITY_THRESHOLD_METERS) {
    throw new Error(
      `You must be closer to the bike's station to start the ride (current: ${distanceToStation.toFixed(0)}m, required: ${PROXIMITY_THRESHOLD_METERS}m).`,
    );
  }
  return true;
}

/**
 * Checks if the user is within proximity to any station.
 * @param userCoords User's current coordinates.
 * @param radiusKm Radius to search for stations.
 * @returns The closest station if found and within proximity, otherwise throws an error.
 */
async function checkProximityToAStation(
  userCoords: Location.LocationObjectCoords,
  radiusKm: number = 1, // Search within 1 km radius
): Promise<Station> {
  const stationRequest: GetStationsRequest = {
    latitude: userCoords.latitude,
    longitude: userCoords.longitude,
    radiusKm: radiusKm,
  };
  const nearbyStations = (await getStationsInRange(stationRequest)).items;

  if (!nearbyStations || nearbyStations.length === 0) {
    throw new Error(
      'No stations found nearby to end the ride. Please move closer to a station.',
    );
  }

  let closestStation: Station | null = null;
  let minDistance = Infinity;

  for (const station of nearbyStations) {
    const distanceToStation = calculateDistance(
      userCoords.latitude,
      userCoords.longitude,
      station.latitude,
      station.longitude,
    );
    if (distanceToStation < minDistance) {
      minDistance = distanceToStation;
      closestStation = station;
    }
  }

  if (!closestStation || minDistance > PROXIMITY_THRESHOLD_METERS) {
    throw new Error(
      `You must be closer to a station to end the ride. Closest station is ${minDistance.toFixed(0)}m away (required: ${PROXIMITY_THRESHOLD_METERS}m).`,
    );
  }
  return closestStation;
}

// --- Ride Management ---

/**
 * Initiates a new ride.
 * @param bikeId The ID of the bike to start the ride with.
 * @param startStationId The ID of the station where the ride is starting.
 * @returns A promise that resolves to the started Ride object.
 */
export async function initiateNewRide(
  bikeId: string,
  startStationId: string | undefined,
): Promise<Ride> {
  if (!startStationId) {
    throw new Error('Bike is not at a station or station ID is missing.');
  }
  const userCoords = await getCurrentUserLocation();
  const bike = await getBike(bikeId);
  const station = await getStation(startStationId);

  await checkProximityToBikeAndStation(userCoords, bike, station);

  const createRideRequest: CreateRideRequest = { bikeId, startStationId };
  const ride = await startRideApi(createRideRequest);
  if (!ride || !ride.id) {
    throw new Error('Failed to start ride. No ride ID received from server.');
  }
  return ride;
}

/**
 * Terminates an active ride.
 * @param rideId The ID of the ride to end.
 * @returns A promise that resolves to the EndRideResponse.
 */
export async function terminateActiveRide(rideId: string) {
  const userCoords = await getCurrentUserLocation();
  // This function will throw an error if no station is nearby and within threshold
  await checkProximityToAStation(userCoords);

  const endRideRequest: EndRideRequest = { id: rideId };
  // The backend should ideally determine the endStationId based on bike's final GPS.
  return await endRideApi(endRideRequest);
}

/**
 * Fetches details of a specific ride.
 * @param rideId The ID of the ride.
 * @returns A promise that resolves to the Ride object.
 */
export async function fetchRideDetails(rideId: string): Promise<Ride | null> {
  try {
    const ride = await getRide(rideId);
    return ride;
  } catch (error) {
    console.error('Error fetching ride details:', error);
    // If ride not found (e.g., 404), API might throw.
    // Depending on API behavior, might return null or re-throw.
    return null;
  }
}

/**
 * Fetches the current ongoing ride for the user.
 * @returns A promise that resolves to the current Ride object, or null if no active ride.
 */
export async function fetchUserCurrentRide(): Promise<Ride | null> {
  try {
    const ride = await getCurrentRide();
    // Ensure it's actually ongoing, though the API name implies this.
    if (ride && ride.id && ride.rideStatus === RideStatus.Ongoing) {
      return ride;
    }
    return null;
  } catch (error) {
    // API might return 404 if no current ride, which axios treats as an error.
    console.warn('No current ride found or error fetching:', error);
    return null;
  }
}

/**
 * Sends the bike's updated location to the backend.
 * This effectively updates the ride's distance on the backend.
 * @param bikeId The ID of the active bike for the ride.
 * @param data The location data.
 * @returns A promise that resolves to the updated Bike object.
 */
export async function sendBikeLocationUpdate(
  bikeId: string,
  data: UpdateRideLocationRequest,
): Promise<Bike> {
  console.log(`Updating location for bike ${bikeId}:`, data);
  // This sends a PATCH request to the /api/bike/ endpoint to update the bike's location.
  // The backend's UpdateBikeEndpoint.cs will then update the associated ride's distance.
  const response = await updateBike({ id: bikeId, ...data });
  return response;
}

// --- Periodic Update Management (Conceptual: actual timer will be in context) ---
// This is just to note the service function that would be called.
export async function handlePeriodicLocationUpdate(
  rideId: string,
): Promise<void> {
  try {
    const currentRide = await fetchRideDetails(rideId);
    if (!currentRide || !currentRide.bikeId) {
      console.warn(
        `Could not find active ride or bike ID for ride ${rideId}. Skipping location update.`,
      );
      return;
    }

    const userCoords = await getCurrentUserLocation();
    const locationData: UpdateRideLocationRequest = {
      latitude: userCoords.latitude,
      longitude: userCoords.longitude,
    };
    // Call the function to send bike location updates
    await sendBikeLocationUpdate(currentRide.bikeId, locationData);
    console.log(
      'Periodic location update for ride (via bike update):',
      rideId,
      locationData,
    );
  } catch (error) {
    console.error('Error during periodic location update:', error);
  }
}

export { RIDE_LOCATION_UPDATE_INTERVAL_MS };

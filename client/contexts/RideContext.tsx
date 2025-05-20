import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import { Alert } from 'react-native';
import { Ride, RideStatus, EndRideResponse } from '@/interfaces/ride';
import * as rideService from '@/services/rideService';
import {
  getStoredActiveRideId,
  setStoredActiveRideId,
  removeStoredActiveRideId,
} from '@/utils/rideSecureStoreUtils';

interface RideContextInterface {
  activeRide: Ride | null;
  isLoading: boolean;
  error: string | null;
  startRideAttempt: (
    bikeId: string,
    startStationId: string | undefined,
  ) => Promise<boolean>;
  endRideAttempt: () => Promise<EndRideResponse | null>;
  clearError: () => void;
}

const RideContext = createContext<RideContextInterface | undefined>(undefined);

export const useRide = (): RideContextInterface => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
};

interface RideProviderProps {
  children: ReactNode;
}

export const RideProvider = ({ children }: RideProviderProps) => {
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading true to check persisted ride
  const [error, setError] = useState<string | null>(null);
  const locationUpdateIntervalRef = useRef<number | null>(null);

  const clearError = () => setError(null);

  // Function to start periodic location updates
  const startLocationUpdates = (rideId: string) => {
    if (locationUpdateIntervalRef.current) {
      clearInterval(locationUpdateIntervalRef.current);
    }
    // Call immediately once, then set interval
    rideService.handlePeriodicLocationUpdate(rideId);
    locationUpdateIntervalRef.current = setInterval(() => {
      rideService.handlePeriodicLocationUpdate(rideId);
    }, rideService.RIDE_LOCATION_UPDATE_INTERVAL_MS);
    console.log(
      `Location updates started for ride ${rideId}. Interval ID: ${locationUpdateIntervalRef.current}`,
    );
  };

  // Function to stop periodic location updates
  const stopLocationUpdates = () => {
    if (locationUpdateIntervalRef.current) {
      clearInterval(locationUpdateIntervalRef.current);
      locationUpdateIntervalRef.current = null;
      console.log('Location updates stopped.');
    }
  };

  // Effect to load persisted ride on mount and manage updates
  useEffect(() => {
    const loadPersistedRide = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const storedRideId = await getStoredActiveRideId();
        if (storedRideId) {
          // Option 1: Fetch user's current ride (if API supports it well for this case)
          // const ride = await rideService.fetchUserCurrentRide();
          // Option 2: Fetch specific ride by ID
          const ride = await rideService.fetchRideDetails(storedRideId);

          if (ride && ride.rideStatus === RideStatus.Ongoing) {
            setActiveRide(ride);
            startLocationUpdates(ride.id);
          } else {
            // Ride ended elsewhere or no longer valid
            await removeStoredActiveRideId();
            setActiveRide(null);
          }
        }
      } catch (e: any) {
        console.error('Failed to load persisted ride:', e);
        setError('Failed to load ride status. ' + (e.message || ''));
        await removeStoredActiveRideId(); // Clear potentially invalid ride ID
      } finally {
        setIsLoading(false);
      }
    };

    loadPersistedRide();

    // Cleanup interval on unmount
    return () => {
      stopLocationUpdates();
    };
  }, []);

  const startRideAttempt = async (
    bikeId: string,
    startStationId: string | undefined,
  ): Promise<boolean> => {
    if (activeRide) {
      setError('An active ride is already in progress.');
      Alert.alert('Error', 'An active ride is already in progress.');
      return false;
    }
    setIsLoading(true);
    setError(null);
    try {
      const newRide = await rideService.initiateNewRide(bikeId, startStationId);
      setActiveRide(newRide);
      await setStoredActiveRideId(newRide.id);
      startLocationUpdates(newRide.id);
      Alert.alert('Success', 'Ride started successfully!');
      return true;
    } catch (e: any) {
      console.error('Failed to start ride:', e);
      setError(e.message || 'Failed to start ride.');
      Alert.alert(
        'Error Starting Ride',
        e.message || 'An unknown error occurred.',
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const endRideAttempt = async (): Promise<EndRideResponse | null> => {
    if (!activeRide) {
      setError('No active ride to end.');
      Alert.alert('Error', 'No active ride to end.');
      return null;
    }
    setIsLoading(true);
    setError(null);
    try {
      const endResponse = await rideService.terminateActiveRide(activeRide.id);
      stopLocationUpdates();
      setActiveRide(null);
      await removeStoredActiveRideId();
      Alert.alert(
        'Success',
        `Ride ended. Fare: ${endResponse.fare}, Duration: ${endResponse.totalDurationMinutes} mins.`,
      );
      return endResponse;
    } catch (e: any) {
      console.error('Failed to end ride:', e);
      setError(e.message || 'Failed to end ride.');
      Alert.alert(
        'Error Ending Ride',
        e.message || 'An unknown error occurred.',
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RideContext.Provider
      value={{
        activeRide,
        isLoading,
        error,
        startRideAttempt,
        endRideAttempt,
        clearError,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};

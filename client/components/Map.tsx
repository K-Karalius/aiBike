import React, { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import MapView, { Region, Details } from 'react-native-maps';
import { GetStationRange, Station } from '@/interfaces/station';
import { getStationsInRangeService } from '@/services/station';
import CustomMarker from './CustomMarker';

const MAP_DELTA: number = 0.01;
const WAIT_TIMER_IN_SECONDS: number = 1;

export default function Map() {
  const [location, setLocation] = useState<Region>({
    latitude: 0, // Default coordinates
    longitude: 0,
    latitudeDelta: MAP_DELTA,
    longitudeDelta: MAP_DELTA,
  });
  const [stations, setStations] = useState<GetStationRange[]>([]);
  const timeoutRef = useRef<number>(0);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      const region = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: MAP_DELTA,
        longitudeDelta: MAP_DELTA,
      };
      setLocation(region);
      mapRef.current?.animateToRegion(region);
      getStations(region);
    };

    getLocation();
  }, []);

  const getStations = async (region: Region) => {
    const response = await getStationsInRangeService(region);
    setStations(response);
  };

  const updateMapStations = (region: Region, details: Details) => {
    // Use the correct Details type
    setLocation(region);

    // Handle potential undefined value with optional chaining
    if (!details?.isGesture) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      getStations(region);
    }, 1000);
  };

  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      initialRegion={location}
      onRegionChangeComplete={updateMapStations}
      customMapStyle={customMapStyle}
      showsUserLocation
    >
      {stations.map((station, index) => (
        <CustomMarker station={station} onPressMarker={() => {}} key={index} />
      ))}
    </MapView>
  );
}

const customMapStyle = [
  {
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [{ visibility: 'on' }],
  },
];

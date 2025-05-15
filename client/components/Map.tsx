import React, { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import MapView, { Region } from 'react-native-maps';
import { GetStationRange, Station } from '@/interfaces/station';
import { getStationsInRangeService } from '@/services/station';
import CustomMarker from './CustomMarker';

const MAP_DELTA: number = 0.01;
const WAIT_TIMER_IN_SECONDS: number = 1;

export default function Map() {
  const [location, setLocation] = useState<Region | undefined>(undefined);
  const [stations, setStations] = useState<GetStationRange[]>([]);
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const timeoutRef = useRef<number>(0);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        setLocation(undefined);
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: MAP_DELTA,
        longitudeDelta: MAP_DELTA,
      });
    };

    if (location === undefined) {
      getLocation();
      getStations();
    }

    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const getStations = async () => {
    const response = await getStationsInRangeService(location);
    setStations(response);
  };

  const updateMapStations = async (region: Region) => {
    setLocation(region);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      getStations();
      setLoaded(false);
    }, WAIT_TIMER_IN_SECONDS * 1000);
  };

  return (
    <MapView
      style={{ flex: 1, marginTop: 50 }} // Margin top used for now to not interfere with the camera, use SafeAreaView laters
      customMapStyle={customMapStyle}
      initialRegion={location}
      showsUserLocation={true}
      onRegionChangeComplete={updateMapStations}
    >
      {stations.map((station: GetStationRange, index) => (
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

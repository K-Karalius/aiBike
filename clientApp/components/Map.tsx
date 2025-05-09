import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import MapView, { Marker, Region } from 'react-native-maps';

export default function Map() {
  const [location, setLocation] = useState<Region | undefined>(undefined);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        setLocation(undefined);
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    };

    getLocation();
  }, []);
  return (
    <MapView
      style={StyleSheet.absoluteFill}
      customMapStyle={customMapStyle}
      initialRegion={location}
      showsUserLocation={true}
    >
      {/* TODO: Generate markers based on the location of the item*/}
      <Marker coordinate={{ latitude: 54.7, longitude: 25.3 }}></Marker>
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

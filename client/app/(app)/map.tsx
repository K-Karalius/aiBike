import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapComponent from '@/components/MapComponent';
import UserOnly from '@/components/auth/UserOnly';
import ActiveRideInfo from '@/components/ActiveRideInfo';
import { useRide } from '@/contexts/RideContext';

export default function MapScreen() {
  const { activeRide } = useRide();

  return (
    <UserOnly>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <MapComponent />
        </View>
        {activeRide && <ActiveRideInfo />}
      </View>
    </UserOnly>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  mapContainer: {
    flex: 1,
  },
});

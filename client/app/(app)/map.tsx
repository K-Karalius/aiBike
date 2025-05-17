import React from 'react';
import { View, StyleSheet } from 'react-native';
import Map from '@/components/Map';
import UserOnly from '@/components/auth/UserOnly';

export default function MapScreen() {
  return (
    <UserOnly>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <Map />
        </View>
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

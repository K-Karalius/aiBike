import React from 'react';
import { View, StyleSheet } from 'react-native';
import Map from '@/components/Map';
import UserOnly from '@/components/auth/UserOnly';

export default function MapScreen() {
  return (
    <UserOnly>
      <View style={styles.container}>
        <Map />
      </View>
    </UserOnly>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});

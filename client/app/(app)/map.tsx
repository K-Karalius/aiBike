import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Map from '@/components/Map';
import UserOnly from '@/components/auth/UserOnly';
import { UserContext } from '@/contexts/UserContext';
import { useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen() {
  const userContext = useContext(UserContext);
  return (
    <UserOnly>
      <SafeAreaView style={styles.container}>
        <Map />
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={userContext.userLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </UserOnly>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

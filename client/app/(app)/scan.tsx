import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserOnly from '@/components/auth/UserOnly';

export default function ScanScreen() {
  const [scanning, setScanning] = useState(false);

  const startScan = () => {
    setScanning(true);
    // Here you would normally activate camera and QR scanning
    // For now, we'll just simulate with a state change
    // Reset after 3 seconds
    setTimeout(() => {
      setScanning(false);
    }, 3000);
  };

  return (
    <UserOnly>
      <View style={styles.container}>
        <View style={styles.scanArea}>
          {scanning ? (
            <View style={styles.scanningOverlay}>
              <Text style={styles.scanningText}>Scanning...</Text>
              <View style={styles.scanFrame} />
            </View>
          ) : (
            <View style={styles.startScanContainer}>
              <Text style={styles.instructionText}>
                Scan a bike QR code to start your ride
              </Text>
              <TouchableOpacity style={styles.scanButton} onPress={startScan}>
                <Ionicons name="scan-outline" size={40} color="white" />
                <Text style={styles.scanButtonText}>Tap to Scan</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </UserOnly>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningOverlay: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanningText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007bff',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#007bff',
    borderRadius: 12,
  },
  startScanContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  instructionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  scanButton: {
    backgroundColor: '#007bff',
    padding: 20,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
  },
  scanButtonText: {
    color: 'white',
    marginTop: 8,
    fontWeight: '500',
  },
});

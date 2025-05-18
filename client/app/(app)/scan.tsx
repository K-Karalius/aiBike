import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserOnly from '@/components/auth/UserOnly';
import { useCameraPermissions } from 'expo-camera';
import { Bike } from '@/interfaces/bike';
import { getBike } from '@/apis/bikeApis';
import BikeScanner from '@/components/BikeScanner';
import BikeInfo from '@/components/BikeInfo';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [scannedBike, setScannedBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const startScan = () => {
    setScanning(true);
    setScannedBike(null);
  };

  const stopScan = () => {
    setScanning(false);
  };

  const handleBarCodeScanned = async (data: string) => {
    stopScan();
    setLoading(true);

    try {
      const bikeId = data;
      const bike = await getBike(bikeId);
      setScannedBike(bike);
    } catch (error) {
      console.error('Error scanning or fetching bike:', error);
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Failed to process the QR code or fetch bike information',
      );
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (!permission) {
      return (
        <Text style={styles.messageText}>Requesting camera permission...</Text>
      );
    }

    if (!permission.granted) {
      return (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={styles.messageText}>
            No access to camera. Please enable camera permissions.
          </Text>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => requestPermission()}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Grant Permission
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading bike information...</Text>
        </View>
      );
    }

    if (scannedBike) {
      return <BikeInfo scannedBike={scannedBike} startScan={startScan} />;
    }

    if (scanning) {
      return (
        <BikeScanner
          onScanSuccess={handleBarCodeScanned}
          onScanCancel={stopScan}
        />
      );
    } else {
      return (
        <View style={styles.startScanContainer}>
          <Text style={styles.instructionText}>
            Scan a bike QR code to start your ride
          </Text>
          <TouchableOpacity style={styles.scanButton} onPress={startScan}>
            <Ionicons name="scan-outline" size={40} color="white" />
            <Text style={styles.scanButtonText}>Tap to Scan</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <UserOnly>
      <View style={styles.container}>
        <View style={styles.scanArea}>{renderContent()}</View>
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
    width: '100%',
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
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6c757d',
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#007bff',
  },
});

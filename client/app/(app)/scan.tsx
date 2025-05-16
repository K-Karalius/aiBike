import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserOnly from '@/components/auth/UserOnly';
import { Camera, CameraType, BarCodeScanningResult } from 'expo-camera';
import { Bike, BikeStatus } from '@/interfaces/bike';
import { getBike } from '@/apis/bikeApis';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scannedBike, setScannedBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Request camera permissions on component mount
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const startScan = () => {
    setScanning(true);
    setScannedBike(null);
  };

  const stopScan = () => {
    setScanning(false);
  };

  const handleBarCodeScanned = async ({
    type,
    data,
  }: BarCodeScanningResult) => {
    stopScan();
    setLoading(true);

    try {
      // Process the QR code data - assuming it contains the bike ID as a number
      // In a real app, you might need to validate or parse the QR format
      const bikeId = parseInt(data);

      if (isNaN(bikeId)) {
        throw new Error('Invalid QR code: not a valid bike ID');
      }

      // Fetch bike information using the API
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

  const getBikeStatusText = (status: BikeStatus): string => {
    switch (status) {
      case BikeStatus.Available:
        return 'Available';
      case BikeStatus.Occupied:
        return 'In Use';
      case BikeStatus.Reserved:
        return 'Reserved';
      case BikeStatus.Unavailable:
        return 'Unavailable';
      default:
        return 'Unknown';
    }
  };

  const getBikeStatusColor = (status: BikeStatus): string => {
    switch (status) {
      case BikeStatus.Available:
        return '#28a745';
      case BikeStatus.Occupied:
        return '#dc3545';
      case BikeStatus.Reserved:
        return '#ffc107';
      case BikeStatus.Unavailable:
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  const renderContent = () => {
    if (hasPermission === null) {
      return (
        <Text style={styles.messageText}>Requesting camera permission...</Text>
      );
    }

    if (hasPermission === false) {
      return (
        <Text style={styles.messageText}>
          No access to camera. Please enable camera permissions.
        </Text>
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
      return (
        <View style={styles.bikeInfoContainer}>
          <Text style={styles.bikeInfoTitle}>Bike Found</Text>

          <View style={styles.bikeInfoCard}>
            <View style={styles.bikeInfoRow}>
              <Text style={styles.bikeInfoLabel}>ID:</Text>
              <Text style={styles.bikeInfoValue}>{scannedBike.id}</Text>
            </View>

            <View style={styles.bikeInfoRow}>
              <Text style={styles.bikeInfoLabel}>Serial Number:</Text>
              <Text style={styles.bikeInfoValue}>
                {scannedBike.serialNumber}
              </Text>
            </View>

            <View style={styles.bikeInfoRow}>
              <Text style={styles.bikeInfoLabel}>Status:</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: getBikeStatusColor(scannedBike.bikeStatus),
                  },
                ]}
              >
                <Text style={styles.statusText}>
                  {getBikeStatusText(scannedBike.bikeStatus)}
                </Text>
              </View>
            </View>

            {scannedBike.currentStationId && (
              <View style={styles.bikeInfoRow}>
                <Text style={styles.bikeInfoLabel}>Station:</Text>
                <Text style={styles.bikeInfoValue}>
                  {scannedBike.currentStationId}
                </Text>
              </View>
            )}
          </View>

          {scannedBike.bikeStatus === BikeStatus.Available && (
            <TouchableOpacity
              style={styles.startRideButton}
              onPress={() =>
                Alert.alert(
                  'Starting Ride',
                  'Ride started with bike ' + scannedBike.id,
                )
              }
            >
              <Text style={styles.startRideButtonText}>Start Ride</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.scanAgainButton} onPress={startScan}>
            <Text style={styles.scanAgainButtonText}>Scan Another Bike</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (scanning) {
      return (
        <View style={styles.cameraContainer}>
          <Camera
            style={StyleSheet.absoluteFillObject}
            type={CameraType.back}
            barCodeScannerSettings={{
              barCodeTypes: ['qr'],
            }}
            onBarCodeScanned={handleBarCodeScanned}
          >
            <View style={styles.scanningOverlay}>
              <View style={styles.scanFrame} />
              <Text style={styles.scanningText}>Scanning for QR code...</Text>
              <TouchableOpacity style={styles.cancelButton} onPress={stopScan}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
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
  cameraContainer: {
    width: '100%',
    height: '100%',
  },
  scanningOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanningText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 5,
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#007bff',
    borderRadius: 12,
  },
  cancelButton: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '500',
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
  bikeInfoContainer: {
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  bikeInfoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  bikeInfoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  bikeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  bikeInfoLabel: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  bikeInfoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  startRideButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 15,
  },
  startRideButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanAgainButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  scanAgainButtonText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '500',
  },
});

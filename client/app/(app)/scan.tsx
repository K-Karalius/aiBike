// screens/(app)/scan.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserOnly from '@/components/auth/UserOnly';
import { useCameraPermissions } from 'expo-camera';
import { Bike } from '@/interfaces/bike';
import { getBike } from '@/apis/bikeApis';
import BikeScanner from '@/components/BikeScanner';
import BikeInfo from '@/components/BikeInfo';
import { useRide } from '@/contexts/RideContext'; // Import useRide
import {
  router, // Assuming expo-router for navigation
} from 'expo-router';
export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [scannedBike, setScannedBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(false);
  const { activeRide, isLoading: isRideContextLoading } = useRide(); // Get active ride status

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // If a ride is active, and the user navigates to scan,
  // potentially reset the scan state unless they explicitly want to scan again.
  useEffect(() => {
    if (activeRide) {
      // If an active ride exists, maybe we don't want to immediately show a new scan button
      // or we want to show the BikeInfo of the *current* ride's bike if it's not already shown.
      // For now, we'll let BikeInfo handle the display if the scannedBike matches the activeRide's bike.
      // If they scan a *different* bike, BikeInfo will show the "you have an active ride" message.
    } else {
      // If no active ride, ensure we are in a scannable state if nothing is scanned.
      if (!scannedBike) {
        // setScanning(false); // Or true if you want to auto-start scan
      }
    }
  }, [activeRide, scannedBike]);

  const startScan = () => {
    if (activeRide && !scannedBike) {
      // If a ride is active and no specific bike has been scanned on this screen yet,
      // perhaps prompt if they want to scan the current bike (e.g. to end ride) or a new one.
      // For simplicity now, we just allow scanning. BikeInfo will handle logic.
    }
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
      // Check if this bike is the one from the active ride
      if (activeRide && activeRide.bikeId === bikeId) {
        // If it's the same bike, BikeInfo will show "End Ride"
      } else if (activeRide && activeRide.bikeId !== bikeId) {
        // If it's a different bike, BikeInfo will show "You have an ongoing ride..."
      }
      const bike = await getBike(bikeId);
      setScannedBike(bike);
    } catch (error: any) {
      console.error('Error scanning or fetching bike:', error);
      Alert.alert(
        'Error',
        error.message ||
          'Failed to process the QR code or fetch bike information',
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
        <View style={styles.permissionContainer}>
          <Text style={styles.messageText}>
            No access to camera. Please enable camera permissions.
          </Text>
          <TouchableOpacity
            style={styles.grantButton}
            onPress={() => requestPermission()}
          >
            <Text style={styles.grantButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // If ride context is loading initial ride state, show global loader
    if (isRideContextLoading && !scannedBike) {
      // Avoid showing if bike already loaded
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Checking ride status...</Text>
        </View>
      );
    }

    if (loading) {
      // This is for bike loading after scan
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading bike information...</Text>
        </View>
      );
    }

    if (scannedBike) {
      // BikeInfo will use useRide() to determine if it's the active ride bike
      // or if another ride is active, and display buttons/messages accordingly.
      return <BikeInfo scannedBike={scannedBike} startScan={startScan} />;
    }

    if (scanning) {
      return (
        <BikeScanner
          onScanSuccess={handleBarCodeScanned}
          onScanCancel={stopScan}
        />
      );
    }

    // If there's an active ride, and we are not scanning, and haven't scanned a bike yet on this screen
    // show a message and an option to view current ride or scan another bike.
    if (activeRide && !scannedBike && !scanning) {
      return (
        <View style={styles.startScanContainer}>
          <Ionicons
            name="bicycle-outline"
            size={60}
            color="#007bff"
            style={{ marginBottom: 10 }}
          />
          <Text style={styles.instructionText}>You have an ongoing ride.</Text>
          <TouchableOpacity
            style={[styles.actionButton, styles.viewRideButton]}
            onPress={() => router.push('/map')} // Navigate to map where ActiveRideInfo is shown
          >
            <Text style={styles.actionButtonText}>View Current Ride</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.scanNewButton]}
            onPress={startScan}
          >
            <Ionicons name="qr-code-outline" size={20} color="#007bff" />
            <Text
              style={[
                styles.actionButtonText,
                { color: '#007bff', marginLeft: 10 },
              ]}
            >
              Scan Bike to End Ride
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Default: No active ride, not scanning, no bike scanned yet -> Show "Tap to Scan"
    return (
      <View style={styles.startScanContainer}>
        <Text style={styles.instructionText}>
          Scan a bike QR code to start your ride
        </Text>
        <TouchableOpacity style={styles.scanButton} onPress={startScan}>
          <Ionicons name="scan-outline" size={50} color="white" />
          <Text style={styles.scanButtonText}>Tap to Scan</Text>
        </TouchableOpacity>
      </View>
    );
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
    backgroundColor: '#f8f9fa', // Light grey background
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  startScanContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '90%',
    maxWidth: 400,
  },
  instructionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 25,
    color: '#343a40', // Darker text
    lineHeight: 24,
  },
  scanButton: {
    backgroundColor: '#007bff', // Primary blue
    padding: 25,
    borderRadius: 75, // More rounded
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  scanButtonText: {
    color: 'white',
    marginTop: 10,
    fontWeight: '600', // Bolder
    fontSize: 16,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6c757d', // Grey text
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  permissionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  grantButton: {
    backgroundColor: '#28a745', // Green
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  grantButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 17,
    color: '#007bff',
    marginTop: 10,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 8,
    width: '90%',
    maxWidth: 300,
  },
  viewRideButton: {
    backgroundColor: '#007bff',
  },
  scanNewButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#007bff',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

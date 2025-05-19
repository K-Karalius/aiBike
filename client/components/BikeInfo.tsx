// components/BikeInfo.tsx
import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Bike, BikeStatus } from '@/interfaces/bike';
import { useStationName } from '@/hooks/useStationName'; // Assuming this hook exists and works
import { useRide } from '@/contexts/RideContext'; // Import the useRide hook

interface BikeInfoProps {
  scannedBike: Bike;
  startScan: () => void; // To allow scanning another bike
}

export default function BikeInfo({ scannedBike, startScan }: BikeInfoProps) {
  const stationName = useStationName(scannedBike?.currentStationId ?? null);
  const {
    activeRide,
    isLoading,
    startRideAttempt,
    endRideAttempt,
    error,
    clearError,
  } = useRide();

  // Clear context error when component unmounts or scannedBike changes
  useEffect(() => {
    return () => {
      if (error) {
        clearError();
      }
    };
  }, [error, clearError, scannedBike]);

  const getBikeStatusText = (status: BikeStatus): string => {
    // If this bike is part of the active ride, show it as "Occupied (Your Ride)"
    if (activeRide && activeRide.bikeId === scannedBike.id) {
      return 'Occupied (Your Ride)';
    }
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
    if (activeRide && activeRide.bikeId === scannedBike.id) {
      return '#007bff'; // Blue for user's current ride bike
    }
    switch (status) {
      case BikeStatus.Available:
        return '#28a745'; // Green
      case BikeStatus.Occupied:
        return '#dc3545'; // Red
      case BikeStatus.Reserved:
        return '#ffc107'; // Yellow
      case BikeStatus.Unavailable:
        return '#6c757d'; // Grey
      default:
        return '#6c757d';
    }
  };

  const handleStartRide = async () => {
    if (!scannedBike.currentStationId) {
      Alert.alert(
        'Error',
        'This bike is not registered at a station and cannot be ridden.',
      );
      return;
    }
    if (scannedBike.bikeStatus !== BikeStatus.Available) {
      Alert.alert('Error', 'This bike is not available to start a ride.');
      return;
    }

    await startRideAttempt(scannedBike.id, scannedBike.currentStationId);
  };

  const handleEndRide = async () => {
    await endRideAttempt();
  };

  const isThisBikePartOfActiveRide = activeRide?.bikeId === scannedBike.id;

  return (
    <View style={styles.bikeInfoContainer}>
      <Text style={styles.bikeInfoTitle}>Bike Details</Text>

      {isLoading && (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      )}

      <View style={styles.bikeInfoCard}>
        <View style={styles.bikeInfoRow}>
          <Text style={styles.bikeInfoLabel}>Serial Number:</Text>
          <Text style={styles.bikeInfoValue}>{scannedBike.serialNumber}</Text>
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

        <View style={styles.bikeInfoRow}>
          <Text style={styles.bikeInfoLabel}>Price:</Text>
          <Text style={styles.bikeInfoValue}>0.22 €/min</Text>
        </View>

        {stationName && (
          <View style={styles.bikeInfoRow}>
            <Text style={styles.bikeInfoLabel}>Station:</Text>
            <Text style={styles.bikeInfoValue}>{stationName}</Text>
          </View>
        )}
      </View>

      {!activeRide && scannedBike.bikeStatus === BikeStatus.Available && (
        <TouchableOpacity
          style={[styles.actionButton, styles.startRideButton]}
          onPress={handleStartRide}
          disabled={isLoading}
        >
          <Text style={styles.actionButtonText}>Start Ride</Text>
        </TouchableOpacity>
      )}

      {isThisBikePartOfActiveRide && (
        <TouchableOpacity
          style={[styles.actionButton, styles.endRideButton]}
          onPress={handleEndRide}
          disabled={isLoading}
        >
          <Text style={styles.actionButtonText}>End Ride</Text>
        </TouchableOpacity>
      )}

      {/* Message if another ride is active with a different bike */}
      {activeRide && !isThisBikePartOfActiveRide && (
        <Text style={styles.infoText}>
          You have an ongoing ride with another bike. End that ride first to
          start a new one.
        </Text>
      )}

      <TouchableOpacity
        style={styles.scanAgainButton}
        onPress={startScan}
        disabled={isLoading}
      >
        <Text style={styles.scanAgainButtonText}>Scan Another Bike</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bikeInfoContainer: {
    padding: 20,
    width: '100%',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  bikeInfoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  bikeInfoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '95%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 25,
  },
  bikeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  bikeInfoLabel: {
    fontSize: 16,
    color: '#555', // Darker grey
    fontWeight: '500',
  },
  bikeInfoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textAlign: 'right',
    flexShrink: 1, // Allow text to shrink if too long
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold', // Bolder
    fontSize: 14,
  },
  actionButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 15,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  startRideButton: {
    backgroundColor: '#28a745', // Green
  },
  endRideButton: {
    backgroundColor: '#dc3545', // Red
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18, // Larger font
    fontWeight: 'bold',
  },
  scanAgainButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 1.5, // Slightly thicker border
    borderColor: '#007bff',
    marginTop: 10,
  },
  scanAgainButtonText: {
    color: '#007bff',
    fontSize: 15, // Slightly larger
    fontWeight: '600', // Bolder
  },
  loader: {
    marginVertical: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
});

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Bike, BikeStatus } from '@/interfaces/bike';
import { useStationName } from '@/hooks/useStationName';
import { router } from 'expo-router';

interface BikeInfoProps {
  scannedBike: Bike;
  startScan: () => void;
}

export default function BikeInfo({ scannedBike, startScan }: BikeInfoProps) {
  const stationName = useStationName(scannedBike?.currentStationId ?? null);

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

  return (
    <View style={styles.bikeInfoContainer}>
      <Text style={styles.bikeInfoTitle}>Bike Found</Text>

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

      {scannedBike.bikeStatus === BikeStatus.Available && (
        <TouchableOpacity
          style={styles.startRideButton}
          onPress={() =>
            router.navigate(`/bike_station?bikeId=${scannedBike.id}`)
          }
        >
          <Text style={styles.startRideButtonText}>Add to station</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.scanAgainButton} onPress={startScan}>
        <Text style={styles.scanAgainButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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

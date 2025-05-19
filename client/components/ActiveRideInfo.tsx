import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRide } from '@/contexts/RideContext';
import { Bike } from '@/interfaces/bike'; // Assuming Bike interface is needed for bike details
import { getBike } from '@/apis/bikeApis'; // To fetch bike details if needed

export default function ActiveRideInfo() {
  const {
    activeRide,
    endRideAttempt,
    isLoading: isRideContextLoading,
  } = useRide();
  const [bikeDetails, setBikeDetails] = useState<Bike | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  const [isLoadingBike, setIsLoadingBike] = useState<boolean>(false);

  // Corrected the type of interval to handle the number returned by setInterval in React Native
  useEffect(() => {
    let intervalId: number | undefined = undefined; // Changed NodeJS.Timeout to number

    if (activeRide) {
      // Fetch bike details if not already part of activeRide or if you need more details
      if (
        activeRide.bikeId &&
        (!bikeDetails || bikeDetails.id !== activeRide.bikeId)
      ) {
        const fetchBike = async () => {
          setIsLoadingBike(true);
          try {
            const bike = await getBike(activeRide.bikeId);
            setBikeDetails(bike);
          } catch (error) {
            console.error(
              'Failed to fetch bike details for active ride:',
              error,
            );
            // Handle error (e.g., show a message)
          } finally {
            setIsLoadingBike(false);
          }
        };
        fetchBike();
      }

      // Calculate elapsed time
      const startTime = new Date(activeRide.startedAtUTC).getTime();
      // setInterval returns a number in React Native/browser environments
      intervalId = setInterval(() => {
        const now = new Date().getTime();
        const duration = now - startTime;

        const hours = Math.floor(
          (duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((duration % (1000 * 60)) / 1000);

        setElapsedTime(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
        );
      }, 1000) as unknown as number; // Explicitly cast if TypeScript is still unsure, or ensure types are aligned
    } else {
      setBikeDetails(null);
      setElapsedTime('00:00:00');
    }

    // Cleanup function
    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    };
  }, [activeRide, bikeDetails]); // Add bikeDetails to dependency array

  if (!activeRide) {
    return null; // Don't render anything if no active ride
  }

  const handleEndRide = async () => {
    await endRideAttempt(); // This function in RideContext handles alerts
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="bicycle" size={24} color="#fff" />
        <Text style={styles.title}>Ride in Progress</Text>
      </View>

      {isLoadingBike ? (
        <ActivityIndicator color="#fff" style={{ marginVertical: 10 }} />
      ) : (
        bikeDetails && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Bike SN:</Text>
            <Text style={styles.value}>{bikeDetails.serialNumber}</Text>
          </View>
        )
      )}

      <View style={styles.detailRow}>
        <Text style={styles.label}>Duration:</Text>
        <Text style={styles.value}>{elapsedTime}</Text>
      </View>

      {/* Placeholder for Fare - this would typically be calculated or streamed from backend */}
      <View style={styles.detailRow}>
        <Text style={styles.label}>Est. Fare:</Text>
        <Text style={styles.value}>--.-- €</Text>
      </View>

      <TouchableOpacity
        style={styles.endRideButton}
        onPress={handleEndRide}
        disabled={isRideContextLoading}
      >
        {isRideContextLoading ? (
          <ActivityIndicator color="#dc3545" />
        ) : (
          <Text style={styles.endRideButtonText}>End Ride</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 123, 255, 0.9)', // Primary blue, slightly transparent
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  endRideButton: {
    backgroundColor: '#fff', // White background for contrast
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#dc3545', // Red border
  },
  endRideButtonText: {
    color: '#dc3545', // Red text
    fontSize: 16,
    fontWeight: 'bold',
  },
});

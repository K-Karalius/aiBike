import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import { Ride, RideStatus } from '../../../interfaces/ride';
import { getAllRides } from '../../../apis/rideApis';
import { PagedResult } from '@/interfaces/pagination';

const RideHistoryScreen: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadRides = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const pagedResult: PagedResult<Ride> = await getAllRides(page, 20);
      setRides((prev) => [...prev, ...pagedResult.items]);
      setHasMore(pagedResult.hasNextPage);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error fetching rides:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRides();
  }, []);

  const renderItem: ListRenderItem<Ride> = ({ item }) => (
    <View style={styles.rideItem}>
      <Text style={styles.date}>
        {new Date(item.startedAtUTC).toLocaleString()}
      </Text>
      <Text>Status: {RideStatus[item.rideStatus]}</Text>
      <Text>Fare: ${item.fareAmount.toFixed(2)}</Text>
      <Text>Distance: {item.distanceMeters} m</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your rides</Text>

      {rides.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No rides found.</Text>
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onEndReached={loadRides}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator size="large" style={{ marginTop: 16 }} />
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    marginTop: 100,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  rideItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  date: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default RideHistoryScreen;

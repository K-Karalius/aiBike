import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { updateBike } from '@/apis/bikeApis';
import { useEffect, useRef, useState } from 'react';
import Map from '@/components/map/Map';
import { Station } from '@/interfaces/station';
import UserOnly from '@/components/auth/UserOnly';
import { Bike } from '@/interfaces/bike';
import UnusedBikeList, {
  BikeListHandle,
} from '@/components/bike/UnusedBikeList';
import { Ionicons } from '@expo/vector-icons';
import Popup from '@/components/Popup';

export default function BikeAndStationManager() {
  const [addTo, setAddTo] = useState<Station | null>(null);
  const [addBikeTo, setAddBikeTo] = useState<Bike | null>(null);
  const bikeId = useRef(useLocalSearchParams<{ bikeId: string }>().bikeId);
  const stationId = useRef(
    useLocalSearchParams<{ stationId: string }>().stationId,
  );
  const refreshKey = useRef<BikeListHandle>(null);

  useEffect(() => {
    const handleRedirect = async () => {
      if (bikeId.current && stationId.current) {
        await updateBike({
          id: bikeId.current,
          currentStationId: stationId.current,
        });
        router.replace('/map');
      }
    };

    if (bikeId.current === '' && stationId.current === '')
      router.replace('/map');

    handleRedirect();
  }, [bikeId, stationId, refreshKey]);

  const onAccept = async () => {
    const bike = {
      id: addBikeTo ? addBikeTo.id : bikeId.current,
      currentStationId: addTo ? addTo.id : stationId.current,
    };
    setAddTo(null);
    setAddBikeTo(null);
    router.replace('/map');
    refreshKey.current?.invokeReload();
    await updateBike(bike);
  };

  return (
    <UserOnly>
      <View style={styles.container}>
        {bikeId.current && (
          <>
            <Map onPressMarker={setAddTo} />
            {addTo ? (
              <Popup
                onCancel={() => setAddTo(null)}
                onAccept={onAccept}
                text={`Add bike to ${addTo.name}?`}
              />
            ) : (
              <TouchableOpacity
                style={styles.floatingButton}
                onPress={router.back}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </>
        )}
        {stationId.current && (
          <>
            <View style={styles.statsContainer}>
              <TouchableOpacity onPress={() => router.replace('/map')}>
                <Ionicons name="arrow-back-outline" size={24} />
              </TouchableOpacity>
              <Text style={styles.statNumber}>Unaccessed bikes</Text>
              <TouchableOpacity onPress={refreshKey.current?.invokeReload}>
                <Ionicons name="reload-outline" size={24} />
              </TouchableOpacity>
            </View>
            <UnusedBikeList
              ref={refreshKey}
              onPress={setAddBikeTo}
              enableDelete={false}
            />
            {addBikeTo && (
              <Popup
                onCancel={() => setAddBikeTo(null)}
                onAccept={onAccept}
                text={`Add bike to the station?`}
              />
            )}
          </>
        )}
      </View>
    </UserOnly>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  floatingButton: {
    position: 'absolute',
    bottom: '5%',
    left: '30%',
    right: '30%',
    backgroundColor: '#e00000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 30,
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
    color: '#333',
  },
});

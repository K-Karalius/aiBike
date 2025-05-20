import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  TextInput,
} from 'react-native';
import UserOnly from '@/components/auth/UserOnly';
import BikeManage from '@/components/bike/BikeManage';
import UnusedBikeList, {
  BikeListHandle,
} from '@/components/bike/UnusedBikeList';
import { Ionicons } from '@expo/vector-icons';
import { createBike } from '@/apis/bikeApis';
import { BikeStatus } from '@/interfaces/bike';

export default function ProfileScreen() {
  const [displayQR, setDisplayQR] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [serialNumber, setSerialNumber] = useState('');
  const list = useRef<BikeListHandle>(null);

  useEffect(() => {}, [refreshKey]);

  const addNewBike = async () => {
    await createBike({
      serialNumber: `SN-${serialNumber}`,
      bikeStatus: BikeStatus.Available,
      longitude: 0,
      latitude: 0,
    });
    setSerialNumber('');
    refresh();
  };

  const refresh = () => {
    list.current?.invokeReload();
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <UserOnly>
      <View style={styles.statsContainer}>
        <Text style={styles.statNumber}>Unaccessed bikes</Text>
        <TouchableOpacity onPress={refresh}>
          <Ionicons name="reload-outline" size={24} />
        </TouchableOpacity>
      </View>
      <UnusedBikeList
        ref={list}
        onPress={(bike) => setDisplayQR(bike.id)}
        enableDelete={true}
      />
      {displayQR !== '' && (
        <BikeManage id={displayQR} onClose={() => setDisplayQR('')} />
      )}
      <View style={styles.row}>
        <Text>SN-</Text>
        <TextInput
          style={styles.input}
          value={serialNumber}
          placeholder="Add the serial number"
          onChangeText={setSerialNumber}
        />
        <Button title="Add a new bike" onPress={addNewBike} />
      </View>
    </UserOnly>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    gap: 3,
  },
  input: {
    flex: 1,
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginVertical: 8,
  },
});

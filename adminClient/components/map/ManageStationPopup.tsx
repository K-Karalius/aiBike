import { deleteStation, patchStation } from '@/apis/stationApis';
import {
  PatchStationRequest,
  PatchStationResponseConflict,
  Station,
} from '@/interfaces/station';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import OptimisticPopup from './OptimisticPopup';
import axios from 'axios';

interface Props {
  onClose: () => void;
  onQR: () => void;
  invokeReload: () => void;
  station: Station;
}

export default function ManageStationPopup({
  onClose,
  onQR,
  station,
  invokeReload,
}: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState<string>(station.name);
  const [size, setSize] = useState<string>(`${station.capacity}`);
  const [optLock, setOptLock] = useState<PatchStationResponseConflict | null>(
    null,
  );

  const onDeleteStation = async () => {
    await deleteStation(station.id);
    onClose();
  };

  const updateStation = async (data: PatchStationRequest): Promise<boolean> => {
    try {
      await patchStation(data);
      return true;
    } catch (err) {
      // eslint-disable-next-line import/no-named-as-default-member
      if (axios.isAxiosError(err)) {
        const data: PatchStationResponseConflict = err.response?.data;
        setOptLock(data);
      }
      return false;
    }
  };

  const onUpdateStation = async () => {
    try {
      const numValue = parseInt(size, 10);

      if (name.trim().length === 0)
        throw new Error('The station name cannot be blank');
      if (!numValue) throw new Error('Station capacity expected an integer');
      if (numValue <= 0)
        throw new Error('The station capacity should be a positive number');

      const updatedStation = {
        id: station.id,
        name: name,
        capacity: numValue,
        longitude: station.longitude,
        latitude: station.latitude,
        rowVersion: station.rowVersion,
      };

      if (!(await updateStation(updatedStation))) return;

      invokeReload();
      onClose();
    } catch (err) {
      if (err instanceof Error) Alert.alert(err.message);
    }
  };

  const closeOpt = async () => {
    setOptLock(null);
    invokeReload();
    onClose();
  };

  const onKeep = async () => {
    station.rowVersion = optLock?.currentData.rowVersion;
    setOptLock(null);
    onUpdateStation();
  };

  const onServer = async () => {
    station.rowVersion = optLock?.currentData.rowVersion;
    station.name = optLock?.currentData.name
      ? optLock?.currentData.name
      : station.name;
    station.capacity = optLock?.currentData.capacity
      ? optLock?.currentData.capacity
      : station.capacity;
    station.longitude = optLock?.currentData.longitude
      ? optLock?.currentData.longitude
      : station.longitude;
    station.latitude = optLock?.currentData.latitude
      ? optLock?.currentData.latitude
      : station.latitude;
    closeOpt();
  };

  return (
    <View style={styles.customPopup}>
      {optLock !== null && (
        <OptimisticPopup
          localData={{
            name: name,
            capacity: parseInt(size, 10),
            longitude: station.longitude,
            latitude: station.latitude,
          }}
          serverData={{
            name: optLock.currentData.name,
            capacity: optLock.currentData.capacity,
            longitude: optLock.currentData.longitude,
            latitude: optLock.currentData.latitude,
          }}
          onKeepLocal={onKeep}
          onUseServer={onServer}
          onClose={closeOpt}
        />
      )}
      {!editing && !confirmDelete && (
        <>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
          <View style={styles.padding}>
            <Text>Editing {station.name} station</Text>
            <Button title="Edit station" onPress={() => setEditing(true)} />
            <Button
              title="Remove station"
              onPress={() => setConfirmDelete(true)}
            />
            <Button title="Get random QR" onPress={onQR} />
          </View>
        </>
      )}
      {confirmDelete && (
        <>
          <Text>Remove the station {station.name}?</Text>
          <View style={styles.row}>
            <Button title="Confirm" color="#39b97c" onPress={onDeleteStation} />
            <Button
              title="Cancel"
              color="#f84444"
              onPress={() => setConfirmDelete(false)}
            />
          </View>
        </>
      )}
      {editing && (
        <>
          <Text style={styles.padding}>Editing station {station.name}</Text>
          <View style={styles.textAndField}>
            <Text style={styles.padding}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Station name"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.textAndField}>
            <Text style={styles.padding}>Capacity</Text>
            <TextInput
              style={styles.input}
              placeholder="Station capacity"
              value={size}
              onChangeText={setSize}
            />
          </View>
          <View style={styles.row}>
            <Button title="Submit" color="#39b97c" onPress={onUpdateStation} />
            <Button
              title="Cancel"
              color="#f84444"
              onPress={() => setEditing(false)}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  customPopup: {
    position: 'absolute',
    width: '80%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    top: '10%',
    left: '50%',
    transform: [{ translateX: '-50%' }],
  },
  padding: {
    padding: 10,
    gap: 20,
  },
  textAndField: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  closeButton: {
    position: 'absolute',
    top: -5,
    right: 10,
    padding: 5,
    zIndex: 10,
  },
  closeText: {
    fontSize: 30,
    fontWeight: 'bold',
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

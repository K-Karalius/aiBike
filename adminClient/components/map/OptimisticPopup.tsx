import { ConflictStation } from '@/interfaces/station';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
} from 'react-native';

interface Props {
  localData: ConflictStation;
  serverData: ConflictStation;
  onKeepLocal: () => void;
  onUseServer: () => void;
  onClose: () => void;
}

export default function OptimisticPopup({
  localData,
  serverData,
  onKeepLocal,
  onUseServer,
  onClose,
}: Props) {
  return (
    <View style={styles.popup}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Conflict Detected</Text>
      <Text style={styles.subheader}>
        Choose which version of the station to keep:
      </Text>

      <ScrollView
        horizontal
        style={styles.scrollView}
        persistentScrollbar={true}
      >
        <View style={styles.column}>
          <Text style={styles.columnHeader}>Your Changes</Text>
          <Text>Name: {localData.name}</Text>
          <Text>Capacity: {localData.capacity}</Text>
          <Text>Longitude: {localData.longitude}</Text>
          <Text>Latitude: {localData.latitude}</Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.columnHeader}>Server Version</Text>
          <Text>Name: {serverData.name}</Text>
          <Text>Capacity: {serverData.capacity}</Text>
          <Text>Longitude: {serverData.longitude}</Text>
          <Text>Latitude: {serverData.latitude}</Text>
        </View>
      </ScrollView>

      <View style={styles.buttonRow}>
        <Button title="Keep Mine" onPress={onKeepLocal} />
        <Button title="Use Server's" onPress={onUseServer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    width: '90%',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    top: '10%',
    left: '5%',
    zIndex: 12,
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    right: 10,
    padding: 5,
    zIndex: 15,
  },
  closeText: {
    fontSize: 28,
    fontWeight: 'bold',
    zIndex: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    zIndex: 12,
  },
  subheader: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
    color: '#555',
    zIndex: 12,
  },
  scrollView: {
    flexDirection: 'row',
    marginBottom: 12,
    zIndex: 12,
  },
  column: {
    flex: 1,
    minWidth: 150,
    marginHorizontal: 10,
    zIndex: 12,
  },
  columnHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
    zIndex: 12,
  },
  row: {
    marginBottom: 6,
    zIndex: 12,
  },
  key: {
    fontWeight: '600',
    color: '#444',
    zIndex: 12,
  },
  value: {
    color: '#222',
    zIndex: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    zIndex: 12,
  },
});

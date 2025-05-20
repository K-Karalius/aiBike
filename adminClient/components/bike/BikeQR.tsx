import { getStation } from '@/apis/stationApis';
import { useState } from 'react';
import { TouchableOpacity, View, Text, Button, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface Props {
  onClose: () => void;
  stationId: string;
}

export default function BikeQR({ onClose, stationId }: Props) {
  const [bikeId, setBikeId] = useState('');

  const getRandomBike = async () => {
    const response = await getStation(stationId);
    if (!response.bikes) return;

    const len = response.bikes.length;

    if (len !== 0) {
      const resp = response.bikes[Math.round(Math.random() * (len - 1.0))];
      setBikeId(resp.id);
    }
  };

  return (
    <View style={styles.customPopup}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>
      <Text>Random bike QR code</Text>
      {bikeId !== '' && (
        <View style={styles.qrContainer}>
          <QRCode value={bikeId} size={200} />
        </View>
      )}
      <Button title="Obtain random bike" onPress={getRandomBike} />
    </View>
  );
}

const styles = StyleSheet.create({
  qrContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  customPopup: {
    position: 'absolute',
    width: '80%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    top: '10%',
    left: '50%',
    transform: [{ translateX: '-50%' }],
    zIndex: 8,
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
});

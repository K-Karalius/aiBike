import { router } from 'expo-router';
import { View, StyleSheet, Text, TouchableOpacity, Button } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface Params {
  id: string;
  onClose: () => void;
}

export default function BikeManage({ id, onClose }: Params) {
  const onPress = () => {
    router.navigate(`/bike_station?bikeId=${id}`);
    onClose();
  };

  return (
    <View style={styles.customPopup}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>
      <Text>Bike QR code</Text>
      <View style={styles.qrContainer}>
        <QRCode value={id} size={200} />
      </View>
      <Button title="Add to station" onPress={onPress} />
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

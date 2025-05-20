import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  onCancel: () => void;
  onAccept: () => void;
  stationName: string;
}

export default function AddBikeToStationPopup({
  onCancel,
  onAccept,
  stationName,
}: Props) {
  return (
    <View style={styles.customPopup}>
      <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>
      <Text>Add bike to {stationName}?</Text>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <Button title="Confirm" color="#39b97c" onPress={onAccept} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  customPopup: {
    position: 'absolute',
    width: '60%',
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

import { View, StyleSheet, Text, Button } from 'react-native';

interface Props {
  onCancel: () => void;
  onAccept: () => void;
  text: string;
}

export default function Popup({ onCancel, onAccept, text }: Props) {
  return (
    <View style={styles.customPopup}>
      <Text>{text}</Text>
      <View style={styles.row}>
        <Button title="Confirm" color="#39b97c" onPress={onAccept} />
        <Button title="Cancel" color="#f84444" onPress={onCancel} />
      </View>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
});

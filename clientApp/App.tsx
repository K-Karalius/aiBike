import { StyleSheet, View } from 'react-native';
import Map from './components/Map';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <Map />
      <View style={navbarStyle.container} />
    </View>
  );
}

const navbarStyle = StyleSheet.create({
  container: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
  },
});

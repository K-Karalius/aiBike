import { StyleSheet, View } from 'react-native';
import Map from './components/Map';

export default function App() {

  return (
    <View style={{flex: 1}}>
      <Map/>
      <View style={navbarStyle}/>
    </View>
  );
}

const navbarStyle = StyleSheet.create({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: "15%",
  backgroundColor: '#4F96D8',
  shadowColor: '#000',
});
import { GetStationRange, Station } from '@/interfaces/station';
import { StyleSheet, Image, Text, View } from 'react-native';
import { Marker, MarkerPressEvent } from 'react-native-maps';

interface Props {
  station: GetStationRange;
  onPressMarker: (event: MarkerPressEvent) => void;
}

export default function CustomMarker({ station, onPressMarker }: Props) {
  return (
    <Marker
      coordinate={{ latitude: station.latitude, longitude: station.longitude }}
      onPress={onPressMarker}
    >
      <View style={styles.markerContainer}>
        <View style={styles.markerBackground} />
        <Image
          source={require('@/assets/images/station.png')}
          style={styles.markerStyle}
        />
        <Text style={styles.markerText}>{station.bikeCount}</Text>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  markerStyle: {
    width: 30,
    height: 40,
    resizeMode: 'contain',
  },
  markerText: {
    position: 'absolute',
    top: 7,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
  },
  markerBackground: {
    position: 'absolute',
    top: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
});

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import * as Location from 'expo-location';
import Animated, {
  Region,
  Details,
  PROVIDER_GOOGLE,
  MapPressEvent,
  // eslint-disable-next-line import/no-duplicates
} from 'react-native-maps';
import { Station } from '@/interfaces/station';
import { getStationsInRangeService } from '@/services/station';
import CustomMarker from './CustomMarker';
// eslint-disable-next-line import/no-duplicates
import MapView from 'react-native-maps';

const MAP_DELTA: number = 0.01;

export interface MapViewHandle {
  animToRegion: (longitude: number, latitude: number) => void;
}

interface Props {
  onPress?: (e: MapPressEvent) => void;
  children?: React.ReactNode;
  onPressMarker?: (station: Station) => void;
}

// eslint-disable-next-line react/display-name
const Map = forwardRef<MapViewHandle, Props>(
  ({ children, onPress, onPressMarker }, ref) => {
    const [location, setLocation] = useState<Region>({
      latitude: 0, // Default coordinates
      longitude: 0,
      latitudeDelta: MAP_DELTA,
      longitudeDelta: MAP_DELTA,
    });
    const [stations, setStations] = useState<Station[]>([]);
    const timeoutRef = useRef<number>(0);
    const mapRef = useRef<Animated>(null);

    useEffect(() => {
      const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access location was denied');
          return;
        }

        const userLocation = await Location.getCurrentPositionAsync({});
        const region = {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: MAP_DELTA,
          longitudeDelta: MAP_DELTA,
        };
        setLocation(region);
        mapRef.current?.animateToRegion(region);
        getStations(region);
      };

      getLocation();
    }, []);

    const getStations = async (region: Region) => {
      const response = await getStationsInRangeService(region);
      setStations(response.value.items);
    };

    const updateMapStations = (region: Region, details: Details) => {
      // Use the correct Details type
      setLocation(region);

      // Handle potential undefined value with optional chaining
      if (!details?.isGesture) return;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        getStations(region);
      }, 1000);
    };

    const animToRegion = async (longitude: number, latitude: number) => {
      mapRef.current?.animateToRegion(
        {
          longitude: longitude,
          latitude: latitude,
          longitudeDelta: MAP_DELTA,
          latitudeDelta: MAP_DELTA,
        },
        500,
      );
    };

    useImperativeHandle(ref, () => ({
      animToRegion,
    }));

    return (
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={location}
        onRegionChangeComplete={updateMapStations}
        customMapStyle={customMapStyle}
        showsUserLocation
        onPress={onPress}
        toolbarEnabled={false}
      >
        {stations.map((station, index) => (
          <CustomMarker
            station={station}
            onPressMarker={onPressMarker}
            key={index}
          />
        ))}
        {children}
      </MapView>
    );
  },
);

const customMapStyle = [
  {
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [{ visibility: 'on' }],
  },
];

export default Map;

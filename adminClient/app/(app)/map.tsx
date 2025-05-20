import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import Map, { MapViewHandle } from '@/components/map/Map';
import UserOnly from '@/components/auth/UserOnly';
import { Ionicons } from '@expo/vector-icons';
import { LatLng, MapPressEvent, Marker } from 'react-native-maps';
import CreateStationPopup, {
  PopupHandle,
} from '@/components/map/CreateStationPopup';
import { createStation } from '@/apis/stationApis';
import { Station } from '@/interfaces/station';
import ManageStationPopup from '@/components/map/ManageStationPopup';
import AddBikeToStationPopup from '@/components/map/AddBikeToStationPopup';
import { router } from 'expo-router';
import BikeQR from '@/components/bike/BikeQR';

export default function MapScreen() {
  const [manageStations, setManageStations] = useState<boolean>(false);
  const mapViewRef = useRef<MapViewHandle>(null);
  const createPopupRef = useRef<PopupHandle>(null);
  const [marker, setMarker] = React.useState<LatLng | null>(null);
  const [createPopupOpen, setCreatePopupOpen] = useState(false);
  const [openStation, setOpenStation] = useState<Station | null>(null);
  const [openQR, setOpenQR] = useState('');

  const handleManageTap = async (e: MapPressEvent) => {
    if (!manageStations) return;
    setCreatePopupOpen(false);
    setOpenStation(null);
    setMarker(e.nativeEvent.coordinate);

    const { longitude, latitude } = e.nativeEvent.coordinate;
    mapViewRef.current?.animToRegion(longitude, latitude);
    setCreatePopupOpen(true);
  };

  const onExitManageStations = () => {
    setMarker(null);
    setManageStations(false);
    setCreatePopupOpen(false);
    setOpenStation(null);
    createPopupRef.current?.resetFields();
  };

  const cancelSelection = () => {
    setMarker(null);
    setCreatePopupOpen(false);
    createPopupRef.current?.resetFields();
  };

  const handleMarkerPress = (station: Station) => {
    if (openStation === station) setOpenStation(null);
    else setOpenStation(station);

    cancelSelection();
  };

  const handleCircleButtonPress = () => {
    setOpenStation(null);
    setManageStations(true);
  };

  const submitButton = async () => {
    try {
      if (!marker) throw new Error('Invalid location');

      const createRequest = createPopupRef.current?.getFilledOutStation(marker);

      if (!createRequest)
        throw new Error('Not all fields filled out correctly');

      await createStation(createRequest);

      onExitManageStations();
    } catch (err) {
      if (err instanceof Error) Alert.alert(err.message);
    }
  };

  const onAddBike = () => {
    if (openStation)
      router.navigate(`/bike_station?stationId=${openStation.id}`);
    setOpenStation(null);
  };

  return (
    <UserOnly>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <Map
            ref={mapViewRef}
            onPress={handleManageTap}
            onPressMarker={handleMarkerPress}
          >
            {marker && <Marker coordinate={marker} />}
          </Map>
          {manageStations ? (
            <>
              <View style={styles.box}>
                <Text style={styles.boxText}>
                  Tap on the map to add a new station, tap on a station to edit
                  it
                </Text>
              </View>
              <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => onExitManageStations()}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.circleButton}
              onPress={handleCircleButtonPress}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          )}
          {openStation && !manageStations && (
            <AddBikeToStationPopup
              onCancel={() => setOpenStation(null)}
              onAccept={onAddBike}
              stationName={openStation.name}
            />
          )}
        </View>
      </View>
      {createPopupOpen && (
        <CreateStationPopup
          ref={createPopupRef}
          onSubmit={submitButton}
          onClose={cancelSelection}
        />
      )}
      {openStation && manageStations && (
        <ManageStationPopup
          onClose={() => setOpenStation(null)}
          station={openStation}
          onQR={() => {
            setOpenQR(openStation.id);
            setOpenStation(null);
          }}
        />
      )}
      {openQR && <BikeQR onClose={() => setOpenQR('')} stationId={openQR} />}
    </UserOnly>
  );
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    right: '5%',
    alignItems: 'center',
  },
  boxText: {
    textAlign: 'center',
    fontSize: 16,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  mapContainer: {
    flex: 1,
  },
  circleButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  floatingButton: {
    position: 'absolute',
    bottom: '5%',
    left: '30%',
    right: '30%',
    backgroundColor: '#e00000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

import { CreateStationRequest } from "@/interfaces/station";
import { forwardRef, useImperativeHandle, useState } from "react"
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from "react-native";
import { LatLng } from "react-native-maps";

export interface PopupHandle {
  getFilledOutStation: (location: LatLng) => CreateStationRequest | null;
  resetFields: () => void;
}

interface Props {
  onSubmit: () => void;
  onClose: () => void;
}

const CreateStationPopup = forwardRef<PopupHandle, Props>(({onSubmit, onClose}, ref) => {
  const [name, setName] = useState<string>('');
  const [size, setSize] = useState<string>('');

  const getFilledOutStation = (location: LatLng): CreateStationRequest => {
    const numValue = parseInt(size, 10);

    if(name.trim().length == 0)
      throw new Error("The station name cannot be blank")
    if(!numValue)
      throw new Error("Station capacity expected an integer");
    if(numValue <= 0)
      throw new Error("The station capacity should be a positive number");

    return {
      name: name,
      latitude: location.latitude,
      longitude: location.longitude,
      capacity: numValue,
    };
  }

  const resetFields = () => {
    setName('');
    setSize('');
  }

  useImperativeHandle(ref, () => ({
    getFilledOutStation,
    resetFields,
  }));
  
  return ( 
    <View style={styles.customPopup}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>
      <Text>Add a new station</Text>
      <TextInput style={styles.input} placeholder="Station name" value={name} onChangeText={setName}/>
      <TextInput style={styles.input} placeholder="Station capacity" value={size} onChangeText={setSize}/>
      <Button title={"Sumbit"} onPress={onSubmit}></Button>
    </View>);
});

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
    transform: [{ translateX: "-50%" }],
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
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginVertical: 8,
  },
});

export default CreateStationPopup;

import { getStations } from "@/apis/stationApis";
import { GetStationsRequest, Station } from "@/interfaces/station";
import { Region } from "react-native-maps"

const DEG_TO_KM = 111.32;

export const getStationsService = async (region: Region | undefined): Promise<Station[]> => {
    const request: GetStationsRequest = {
        latitude: region?.latitude ?? 0,
        longitude: region?.longitude ?? 0,
        radiusKm: (region?.latitudeDelta ?? 0) * DEG_TO_KM,
        pageSize: 100,
    }
    const response = getStations(request);
    return response;
}
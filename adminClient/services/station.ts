import { getStationsInRange, patchStation } from '@/apis/stationApis';
import { CreateStationRequest, GetStationRange, GetStationsRequest, PatchStationRequest } from '@/interfaces/station';
import { Region } from 'react-native-maps';

const DEG_TO_KM = 111.32;

export const getStationsInRangeService = async (
  region: Region | undefined,
): Promise<GetStationRange[]> => {
  const request: GetStationsRequest = {
    latitude: region?.latitude ?? 0,
    longitude: region?.longitude ?? 0,
    radiusKm: (region?.latitudeDelta ?? 0) * DEG_TO_KM,
    pageSize: 100,
  };
  const response = getStationsInRange(request);
  return response;
};

export const updateStation = async (data: PatchStationRequest) => {
  // Add optimistic locking logic
  await patchStation(data);
};
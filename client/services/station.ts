import { getStationsInRange } from '@/apis/stationApis';
import { SuccessDecorator } from '@/interfaces/decorator';
import {
  GetStationRangeResponse,
  GetStationsRequest,
} from '@/interfaces/station';
import { Region } from 'react-native-maps';

const DEG_TO_KM = 111.32;

export const getStationsInRangeService = async (
  region: Region | undefined,
): Promise<SuccessDecorator<GetStationRangeResponse>> => {
  const request: GetStationsRequest = {
    latitude: region?.latitude ?? 0,
    longitude: region?.longitude ?? 0,
    radiusKm: (region?.latitudeDelta ?? 0) * DEG_TO_KM,
    pageSize: 100,
  };
  const response = getStationsInRange(request);
  return response;
};

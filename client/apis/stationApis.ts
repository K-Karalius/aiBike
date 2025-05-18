import {
  CreateStationRequest,
  GetStationRange,
  GetStationsRequest,
  Station,
} from '@/interfaces/station';
import api from '@/apis/api';
import { AxiosResponse } from 'axios';

export const createStation = async (
  data: CreateStationRequest,
): Promise<Station> => {
  const response = await api.post('/station', data);
  return response.data;
};

export const getStation = async (id: number): Promise<Station> => {
  const response = await api.get(`/station/${id}`);
  return response.data;
};

export const getStationsInRange = async (
  data: GetStationsRequest,
): Promise<GetStationRange[]> => {
  const response = await api.get('/station', { params: data });
  return response.data;
};

export const deleteStation = async (
  data: CreateStationRequest,
): Promise<AxiosResponse> => {
  const response = await api.delete('/station');
  return response.data;
};

/* Potential method when the time is right
export const updateStation = async (data: ): Promise<Station> => {
    const response = await api.post("/station", data);
    return response.data;
}*/

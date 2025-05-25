import {
  CreateStationRequest,
  GetStationRangeResponse,
  GetStationsRequest,
  PatchStationRequest,
  PatchStationResponseConflict,
  Station,
} from '@/interfaces/station';
import api from '@/apis/api';
import { AxiosResponse } from 'axios';
import { SuccessDecorator } from '@/interfaces/decorator';

export const createStation = async (
  data: CreateStationRequest,
): Promise<Station> => {
  const response = await api.post('/station', data);
  return response.data;
};

export const getStation = async (id: string): Promise<Station> => {
  const response = await api.get(`/station/${id}`);
  return response.data;
};

export const getStationsInRange = async (
  data: GetStationsRequest,
): Promise<SuccessDecorator<GetStationRangeResponse>> => {
  const response = await api.get('/station', { params: data });
  return response.data;
};

export const deleteStation = async (id: string): Promise<AxiosResponse> => {
  const response = await api.delete(`/station/${id}`);
  return response.data;
};

export const patchStation = async (
  data: PatchStationRequest,
): Promise<Station> => {
  const response = await api.patch('/station', data);
  return response.data;
};

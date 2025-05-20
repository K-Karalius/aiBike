import api from '@/apis/api';
import { CreateRideRequest, Ride } from '@/interfaces/ride';

export const startRide = async (request: CreateRideRequest): Promise<Ride> => {
  const response = await api.post(`/ride`, request);
  return response.data;
};

export const getRide = async (id: string): Promise<Ride> => {
  const response = await api.get(`/ride/${id}`);
  return response.data;
};

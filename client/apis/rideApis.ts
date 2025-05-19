import api from '@/apis/api';
import {
  Ride,
  CreateRideRequest,
  EndRideRequest,
  EndRideResponse,
} from '@/interfaces/ride';

export const startRide = async (request: CreateRideRequest): Promise<Ride> => {
  const response = await api.post(`/api/ride/start`, request);
  return response.data;
};

export const getRide = async (id: string): Promise<Ride> => {
  const response = await api.get(`/api/ride/${id}`);
  return response.data;
};

export const getAllRides = async (
  page: number = 1,
  pageSize: number = 50,
): Promise<Ride[]> => {
  const response = await api.get(`/api/ride?page=${page}&pageSize=${pageSize}`);
  return response.data;
};

export const getCurrentRide = async (): Promise<Ride> => {
  const response = await api.get(`/api/ride/current`);
  return response.data;
};

export const getRideByBike = async (bikeId: string): Promise<Ride> => {
  const response = await api.get(`/api/ride/bike/${bikeId}`);
  return response.data;
};

export const endRide = async (
  request: EndRideRequest,
): Promise<EndRideResponse> => {
  const response = await api.patch(`/api/ride/end`, request);
  return response.data;
};

export const deleteRide = async (id: string): Promise<void> => {
  await api.delete(`/api/ride/${id}`);
};

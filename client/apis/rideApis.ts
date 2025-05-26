import api from '@/apis/api';
import { PagedResult } from '@/interfaces/pagination';
import {
  Ride,
  CreateRideRequest,
  EndRideRequest,
  EndRideResponse,
} from '@/interfaces/ride';

export const startRide = async (request: CreateRideRequest): Promise<Ride> => {
  const response = await api.post(`/ride/start`, request);
  return response.data;
};

export const getRide = async (id: string): Promise<Ride> => {
  const response = await api.get(`/ride/${id}`);
  return response.data;
};

export const getAllRides = async (
  page: number = 1,
  pageSize: number = 50,
): Promise<PagedResult<Ride>> => {
  const response = await api.get(`/ride?page=${page}&pageSize=${pageSize}`);
  return response.data;
};

export const getCurrentRide = async (): Promise<Ride> => {
  const response = await api.get(`/ride/current`);
  return response.data;
};

export const getRideByBike = async (bikeId: string): Promise<Ride> => {
  const response = await api.get(`/ride/bike/${bikeId}`);
  return response.data;
};

export const endRide = async (
  request: EndRideRequest,
): Promise<EndRideResponse> => {
  const response = await api.patch(`/ride/end`, request);
  return response.data;
};

export const deleteRide = async (id: string): Promise<void> => {
  await api.delete(`/ride/${id}`);
};

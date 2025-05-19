import api from '@/apis/api';
import { Bike, CreateBikeRequest, UpdateBikeRequest } from '@/interfaces/bike';

export const getBike = async (id: string): Promise<Bike> => {
  const response = await api.get(`/bike/${id}`);
  return response.data;
};

export const getAllBikes = async (
  page: number = 1,
  pageSize: number = 50,
): Promise<Bike[]> => {
  const response = await api.get(`/bike?page=${page}&pageSize=${pageSize}`);
  return response.data;
};

export const createBike = async (request: CreateBikeRequest): Promise<Bike> => {
  const response = await api.post(`/bike`, request);
  return response.data;
};

export const updateBike = async (request: UpdateBikeRequest): Promise<Bike> => {
  const response = await api.patch(`/bike`, request);
  return response.data;
};

export const deleteBike = async (id: string): Promise<void> => {
  await api.delete(`/bike/${id}`);
};

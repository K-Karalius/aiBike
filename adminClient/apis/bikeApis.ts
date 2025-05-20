import api from '@/apis/api';
import {
  Bike,
  CreateBikeRequest,
  GetBikesResponse,
  UpdateBikeRequest,
} from '@/interfaces/bike';

export const getBike = async (id: string): Promise<Bike> => {
  const response = await api.get(`/bike/${id}`);
  return response.data;
};

export const createBike = async (bike: CreateBikeRequest): Promise<Bike> => {
  const response = await api.post('/bike', bike);
  return response.data;
};

export const getBikes = async (
  page: number,
  pageSize: number,
): Promise<GetBikesResponse> => {
  const response = await api.get('/bike', {
    params: { page: page, pageSize: pageSize },
  });
  return response.data;
};

export const updateBike = async (request: UpdateBikeRequest): Promise<Bike> => {
  const response = await api.patch(`/bike`, request);
  return response.data;
};

export const deleteBike = async (id: string): Promise<void> => {
  await api.delete(`/bike/${id}`);
};

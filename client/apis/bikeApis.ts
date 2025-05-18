import api from '@/apis/api';
import { Bike } from '@/interfaces/bike';

export const getBike = async (id: string): Promise<Bike> => {
  const response = await api.get(`/bike/${id}`);
  return response.data;
};

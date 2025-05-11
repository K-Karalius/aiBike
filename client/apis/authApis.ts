import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '../interfaces/auth';
import api from '../apis/api';
import { AxiosResponse } from 'axios';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', data);
  return response.data;
};

export const register = async (
  data: RegisterRequest,
): Promise<AxiosResponse> => {
  const response = await api.post<AxiosResponse>('/auth/register', data);
  return response;
};

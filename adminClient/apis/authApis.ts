import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
} from '../interfaces/auth';
import api from '../apis/api';
import { AxiosResponse } from 'axios';

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/admin/auth/login/', data);
  return response.data;
};

export const refreshTokenApi = async (
  data: RefreshTokenRequest,
): Promise<RefreshTokenResponse> => {
  const response = await api.post<RefreshTokenResponse>('/auth/refresh', data);
  return response.data;
};

export const registerUser = async (
  data: RegisterRequest,
): Promise<AxiosResponse> => {
  const response = await api.post<AxiosResponse>('admin/auth/register', data);
  return response;
};

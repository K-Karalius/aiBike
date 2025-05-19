import axios, { isAxiosError } from 'axios';
import {
  getRefreshToken,
  getToken,
  setRefreshToken,
  setToken,
} from '../utils/secureStoreUtils';
import { RefreshTokenRequest, RefreshTokenResponse } from '@/interfaces/auth';
import { router } from 'expo-router';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 2500,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const refreshTokenApi = async (
  data: RefreshTokenRequest,
): Promise<RefreshTokenResponse> => {
  const response = await axios.post<RefreshTokenResponse>(
    `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
    data,
  );
  return response.data;
};

let refreshingToken: Promise<RefreshTokenResponse> | null = null;

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const config = error.config;

    if (error.response && error.response.status === 401 && !config._retry) {
      config._retry = true;
      try {
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          refreshingToken = refreshingToken
            ? refreshingToken
            : refreshTokenApi({ refreshToken });

          let data = await refreshingToken;
          refreshingToken = null;
          await setToken(data.accessToken);
          await setRefreshToken(data.refreshToken);
          api.defaults.headers.common['Authorization'] =
            `Bearer ${data.accessToken}`;
          return api(config);
        }
      } catch (refreshError) {
        router.replace('/login');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(handleAxiosError(error));
  },
);

const handleAxiosError = (error: any): Error => {
  let errorMessage = 'An unexpected error occurred';

  if (isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    switch (status) {
      case 400:
        errorMessage = 'Invalid request. Please check your data.';
        break;
      case 401:
        errorMessage = 'Incorrect email or password. Try again.';
        break;
      case 403:
        errorMessage = "You don't have permission to access this resource.";
        break;
      case 404:
        errorMessage = 'The requested resource was not found.';
        break;
      case 500:
        errorMessage =
          'An internal server error occurred. Please try again later.';
        break;
      default:
        errorMessage = `An error occurred: ${message}`;
    }
  }

  return new Error(errorMessage);
};

export default api;

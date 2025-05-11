import axios, { isAxiosError } from 'axios';
import { getToken } from '../utils/secureStoreUtils';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 2500,
  headers: {
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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
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

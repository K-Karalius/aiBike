import * as SecureStore from 'expo-secure-store';

export const setToken = async (token: string) => {
  await SecureStore.setItemAsync('userToken', token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync('userToken');
};

export const removeToken = async () => {
  await SecureStore.deleteItemAsync('userToken');
};

export const setRefreshToken = async (refreshToken: string) => {
  await SecureStore.setItemAsync('refreshToken', refreshToken);
};

export const getRefreshToken = async () => {
  return await SecureStore.getItemAsync('refreshToken');
};

export const removeRefreshToken = async () => {
  await SecureStore.deleteItemAsync('refreshToken');
};

export const setEmail = async (email: string) => {
  await SecureStore.setItemAsync('email', email);
};

export const getEmail = async () => {
  return await SecureStore.getItemAsync('email');
};

export const removeEmail = async () => {
  await SecureStore.deleteItemAsync('email');
};

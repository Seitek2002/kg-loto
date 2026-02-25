// src/lib/api.ts
import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const toCamelCase = (str: string) =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

const toSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const isPlainObject = (obj: any): boolean => {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    !Array.isArray(obj) &&
    !(obj instanceof FormData) &&
    !(obj instanceof File) &&
    !(obj instanceof Blob) &&
    !(obj instanceof Date)
  );
};

const keysToCamel = (obj: any): any => {
  if (isPlainObject(obj)) {
    const n: Record<string, any> = {};
    Object.keys(obj).forEach((k) => {
      n[toCamelCase(k)] = keysToCamel(obj[k]);
    });
    return n;
  } else if (Array.isArray(obj)) {
    return obj.map((i) => keysToCamel(i));
  }
  return obj;
};

const keysToSnake = (obj: any): any => {
  if (isPlainObject(obj)) {
    const n: Record<string, any> = {};
    Object.keys(obj).forEach((k) => {
      n[toSnakeCase(k)] = keysToSnake(obj[k]);
    });
    return n;
  } else if (Array.isArray(obj)) {
    return obj.map((i) => keysToSnake(i));
  }
  return obj;
};

export const api = axios.create({
  baseURL: 'https://crm.kgloto.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data) {
    config.data = keysToSnake(config.data);
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = keysToCamel(response.data);
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    if (error.response?.data) {
      error.response.data = keysToCamel(error.response.data);
    }

    return Promise.reject(error);
  },
);

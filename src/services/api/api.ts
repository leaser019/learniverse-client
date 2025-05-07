import envConfig from '@/config';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_URL = envConfig.NEXT_PUBLIC_API_ENDPOINT;
const DEFAULT_TIMEOUT = 30000;

const HEADER = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
};

export type ApiResponse<T = any> = {
  data: T;
  status: number;
  success: boolean;
  message?: string;
};

export type ApiError = {
  status: number;
  message: string;
  details?: any;
};

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    [HEADER.CONTENT_TYPE]: 'application/json',
    [HEADER.API_KEY]: envConfig.NEXT_PUBLIC_API_KEY,
  },
  timeout: DEFAULT_TIMEOUT,
  withCredentials: true,
});

const getClientToken = (): string | undefined =>
  document.cookie
    .split('; ')
    .find((row) => row.startsWith('accessToken='))
    ?.split('=')[1];

const getClientId = (): string | undefined =>
  document.cookie
    .split('; ')
    .find((row) => row.startsWith('clientId='))
    ?.split('=')[1];

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getClientToken();
    const clientId = getClientId();
    if (token && config.headers) {
      config.headers[HEADER.AUTHORIZATION] = `Bearer ${token}`;
      config.headers[HEADER.CLIENT_ID] = clientId || '';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (res: AxiosResponse): any => res.data as ApiResponse,
  (error: AxiosError) => {
    const status = error.response?.status || 500;
    const formatted: ApiError = {
      status,
      message: error.message,
      details: error.response?.data,
    };
    if (status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login';
      return;
    }
    console.error('API error:', formatted);
    return formatted;
  }
);

export default apiClient;

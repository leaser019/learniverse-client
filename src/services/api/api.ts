import envConfig from '@/config';
import { HEADER } from '@/constants';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
interface ApiResponse {
  data: unknown;
  status: number;
  message: string;
}

interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

const API_URL = envConfig.NEXT_PUBLIC_API_ENDPOINT;
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    [HEADER.API_KEY]: envConfig.NEXT_PUBLIC_API_KEY,
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (res: AxiosResponse): any => res.data as ApiResponse,
  async (error: AxiosError) => {
    const status = error.response?.status || 500;

    if (status === 401) {
      try {
        await axios.post(`${API_URL}/user/refresh-token`, {}, { withCredentials: true });
        return apiClient(error.config as InternalAxiosRequestConfig);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    const formatted: ApiError = {
      status,
      message: error.message,
      details: error.response?.data,
    };

    return Promise.reject(formatted);
  }
);

export default apiClient;

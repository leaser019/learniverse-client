import apiClient from './api';

const authApi = {
  login: async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await apiClient.post('/user/login', { email, password });
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await apiClient.post('/user/logout');
      return response;
    } catch (error) {
      throw error;
    }
  },

  signup: async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await apiClient.post('/user/signup', { username, email, password });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default authApi;

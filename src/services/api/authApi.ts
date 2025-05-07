import apiClient from "./api";

export const authApi = {
  signup: async ({username, email, password}: {username: string, email: string, password: string}) => {
    try {
      const response = await apiClient.post('/user/signup', { username, email, password });
      console.log('Signup response:', response);
      return response;
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      throw new Error(errorMessage);
    }
  },
  login: async ({email, password}: {email: string, password: string}) => { 
    try { 
      const response = await apiClient.post('/user/login', { email, password });
      return response;
    } catch (error: Error | unknown) { 
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      throw new Error(errorMessage);
    }
  }

}
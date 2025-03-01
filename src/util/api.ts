import axios from 'axios';
import { getCurrentUser } from '@/services/cognito-service';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the Bearer token for authorization
api.interceptors.request.use(
  async (config) => {
    const user = getCurrentUser();
    if (user) {
      user.getSession(
        (
          err: Error | null,
          session: { getIdToken: () => { getJwtToken: () => string } }
        ) => {
          if (err) {
            console.error('Error getting session:', err);
            return;
          }
          const token = session.getIdToken().getJwtToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      );
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

let accessToken: string | null = null;
let tokenListener: ((token: string | null) => void) | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (tokenListener) tokenListener(token);
};

export const setTokenListener = (listener: (token: string | null) => void) => {
  tokenListener = listener;
};

const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosPrivate.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post<{ accessToken: string }>(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken); // Updates both the variable and the listener
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosPrivate(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);



export default axiosPrivate;

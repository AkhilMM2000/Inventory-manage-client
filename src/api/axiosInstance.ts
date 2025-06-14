import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// 👉 Request Interceptor: attach token
axiosPrivate.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 👉 Response Interceptor: handle 401 and retry once
axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 🔄 Call refresh endpoint
        const res = await axios.post<{accessToken:string}>(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
          withCredentials: true,
        });

        const newAccessToken = res.data.accessToken;

        // ♻️ Update token and retry request
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosPrivate(originalRequest); // retry original request
      } catch (refreshError) {
        console.error("🔁 Refresh token failed:", refreshError);
        localStorage.removeItem("accessToken");
        window.location.href ='/login'
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosPrivate;

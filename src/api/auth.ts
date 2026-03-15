import axios from "axios";
import axiosPrivate from "./axiosInstance";
import type { TokenPayload } from "../types/user"; 
import { API_ROUTES } from "../routes/apiRoutes";
interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}
interface LoginPayload {
  email: string;
  password: string;
}

export const registerUser = async (payload: RegisterPayload) => {
    console.log( `${import.meta.env.VITE_API_URL}/auth/register`)
    const response = await axios.post(
   API_ROUTES.AUTH.REGISTER, 
    payload,
    { withCredentials: true } 
  );
  return response.data;
};


export const loginUser = async (payload: LoginPayload) => {
  const response = await axios.post(API_ROUTES.AUTH.LOGIN, payload, {
    withCredentials: true,
  });
  return response.data;
};


export const getCurrentUser = async () => {
  
  const response = await axiosPrivate.get(API_ROUTES.AUTH.CURRENT_USER);
  return response.data.user as TokenPayload;
};


export const logout = async (): Promise<void> => {
  await axiosPrivate.post(API_ROUTES.AUTH.LOGOUT);
};

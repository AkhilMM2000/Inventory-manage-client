import axios from "axios";

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
    `${import.meta.env.VITE_API_URL}/auth/register`, 
    payload,
    { withCredentials: true } 
  );
  return response.data;
};


export const loginUser = async (payload: LoginPayload) => {
  const response = await axios.post(  `${import.meta.env.VITE_API_URL}/auth/login`, payload, {
    withCredentials: true,
  });
  return response.data;
};

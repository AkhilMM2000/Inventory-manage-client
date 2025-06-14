import axiosPrivate from "./axiosInstance";

interface NewItemPayload {
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export const addItem = async (item: NewItemPayload) => {
  const response = await axiosPrivate.post("/items", item);
  return response.data;
};

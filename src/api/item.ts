import axiosPrivate from "./axiosInstance";
import type { Item } from "../types/Item"; 
import { API_ROUTES } from "../routes/apiRoutes";

interface NewItemPayload {
  name: string;
  description: string;
  quantity: number;
  price: number;
}
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const getItems = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<PaginatedResult<Item>> => {
    const response = await axiosPrivate.get(API_ROUTES.ITEMS.SEARCH(page, limit, search));
  return response.data;
};

export const deleteItemById = async (id: string) => {
   const response = await axiosPrivate.delete(API_ROUTES.ITEMS.DELETE(id));
  return response.data;
};

export const updateItemById = async (id: string, updatedItem: Partial<Item>) => {
  console.log(id,updatedItem,'response from server')
  const response = await axiosPrivate.put(API_ROUTES.ITEMS.UPDATE(id), updatedItem);
  
  return response.data;
};


export const addItem = async (item: NewItemPayload) => {
  const response = await axiosPrivate.post(API_ROUTES.ITEMS.ADD, item);
  return response.data;
};

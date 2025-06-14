import axiosPrivate from "./axiosInstance";
import type { Item } from "../types/Item"; 

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
  const response = await axiosPrivate.get(
    `/items/search?page=${page}&limit=${limit}&search=${search}`
  );
  return response.data;
};

export const deleteItemById = async (id: string) => {
  const response = await axiosPrivate.delete(`/items/${id}`);
  return response.data;
};

export const updateItemById = async (id: string, updatedItem: Partial<Item>) => {
  const response = await axiosPrivate.put(`/items/${id}`, updatedItem);
  return response.data;
};

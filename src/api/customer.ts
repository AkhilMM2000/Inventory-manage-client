import axiosPrivate from "./axiosInstance";
import type { Customer, CustomerFormData } from "../types/Customer";
import type { PaginatedResult } from "./item";
import { API_ROUTES } from "../routes/apiRoutes";

export const getCustomers = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<PaginatedResult<Customer>> => {
  const response = await axiosPrivate.get(
    API_ROUTES.CUSTOMERS.GET_ALL(page, limit, search)
  );
  return response.data;
};

export const addCustomer = async (customer: CustomerFormData): Promise<Customer> => {
  const response = await axiosPrivate.post(API_ROUTES.CUSTOMERS.BASE, customer);
  return response.data.customer;
};

export const updateCustomer = async (
  id: string,
  updated: Partial<Customer>
): Promise<Customer> => {
  const response = await axiosPrivate.put(API_ROUTES.CUSTOMERS.UPDATE(id), updated);
  return response.data.customer;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await axiosPrivate.delete(API_ROUTES.CUSTOMERS.DELETE(id));
};

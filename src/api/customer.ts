import axiosPrivate from "./axiosInstance";
import type { Customer } from "../types/Customer"; 
import type { PaginatedResult } from "./item";



// ✅ Get all customers with optional search
export const getCustomers = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<PaginatedResult<Customer>> => {
  const response = await axiosPrivate.get(
    `/customers?page=${page}&limit=${limit}&search=${search}`
  );
  return response.data;
};

// ✅ Add a customer
export const addCustomer = async (customer: {
  name: string;
  address: string;
  mobile: string;
}): Promise<Customer> => {
  const response = await axiosPrivate.post("/customers", customer);
  return response.data.customer;
};

// ✅ Update a customer
export const updateCustomer = async (
  id: string,
  updated: Partial<Customer>
): Promise<Customer> => {
  const response = await axiosPrivate.put(`/customers/${id}`, updated);
  return response.data.customer;
};

// ✅ Delete a customer
export const deleteCustomer = async (id: string): Promise<void> => {
  await axiosPrivate.delete(`/customers/${id}`);
};

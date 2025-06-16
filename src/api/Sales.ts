import axiosPrivate from "./axiosInstance";
import type { Sale, SaleItem } from "../types/Sales"; 
import type { Customer } from "../types/Customer";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const getSales = async (
  page = 1,
  limit = 10,
  search = "",
  paymentType?: "Cash" | "Credit"
): Promise<PaginatedResult<Sale>> => {
  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  };

  if (search) params.search = search;
  if (paymentType) params.paymentType = paymentType;

  const response = await axiosPrivate.get("/sales", { params });
  return response.data;
};

export const createSale = async (data: {
  customerId: string;
  customerName: string;
  paymentType: "Cash" | "Credit";
  items: SaleItem[];
}): Promise<Sale> => {
  const response = await axiosPrivate.post("/sales", data);
  return response.data.sale;
};

interface CustomerLedgerResponse {
  customer: Customer;
  sales: Sale[];
  summary: {
    totalOrders: number;
    totalSales: number;
    cashPaid: number;
    creditOutstanding: number;
  };
}

export const getCustomerLedger = async (
  customerId: string
): Promise<CustomerLedgerResponse> => {
  const response = await axiosPrivate.get(`/sales/customer/${customerId}`);
  return response.data;
};
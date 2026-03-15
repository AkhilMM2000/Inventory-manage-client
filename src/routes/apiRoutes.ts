const BASE_URL = import.meta.env.VITE_API_URL;

export const API_ROUTES = {
  AUTH: {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    CURRENT_USER: `${BASE_URL}/auth/me`,
  },
   CUSTOMERS: {
    BASE: `${BASE_URL}/customers`,
    GET_ALL: (page = 1, limit = 10, search = "") =>
      `/customers?page=${page}&limit=${limit}&search=${search}`,
    UPDATE: (id: string) => `${BASE_URL}/customers/${id}`,
    DELETE: (id: string) => `${BASE_URL}/customers/${id}`,
    LEDGER: (id: string) => `/customers/customer/${id}`,
  },
   ITEMS: {
   
    SEARCH: (page = 1, limit = 10, search = "") =>
      `/items/search?page=${page}&limit=${limit}&search=${search}`,
    ADD: `/items`,
    UPDATE: (id: string) => `/items/${id}`,
    DELETE: (id: string) => `/items/${id}`,
  },

  SALES: {
  BASE:`/sales`,
   LEDGER: (id: string) => `/sales/customer/${id}`,
  }
};

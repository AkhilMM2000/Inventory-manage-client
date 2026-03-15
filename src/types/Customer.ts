export interface Address {
  line1: string;
  line2?: string;
  city: string;
  district: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Customer {
  id: string;
  name: string;
  address: Address;
  mobile: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFormData {
  name: string;
  address: Address;
  mobile: string;
}

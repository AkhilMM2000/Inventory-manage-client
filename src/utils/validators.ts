import type { Address } from "../types/Customer";

export const validateName = (name: string): string | null => {
  const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
  if (!name.trim()) return "Full name is required.";
  if (!nameRegex.test(name)) return "Name can only contain letters and single spaces.";
  if (name.trim().length < 3) return "Full name must be at least 3 characters.";
  return null;
};

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return "Email is required.";
  if (!emailRegex.test(email)) return "Invalid email format.";
  return null;
};

export const validatePassword = (password: string): string | null => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!password.trim()) return "Password is required.";
  if (!passwordRegex.test(password)) {
    return "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, and 1 number.";
  }
  return null;
};

export const validateDescription = (desc: string): string | null => {
  if (!desc.trim()) return "Description is required.";
  if (desc.length < 5) return "Description must be at least 5 characters.";
  return null;
};

export const validateQuantity = (qty: number): string | null => {
  if (qty === undefined || qty < 0) return "Quantity must be 0 or more.";
  return null;
};

export const validatePrice = (price: number): string | null => {
  if (price === undefined || price <= 0) return "Price must be greater than 0.";
  return null;
};

export const validateAddress = (address: Address): string | null => {
  const { line1, city, district, state, postalCode, country } = address;

  if (!line1.trim()) return "Address line1 is required.";
  if (!city.trim()) return "City is required.";
  if (!district.trim()) return "District is required.";
  if (!state.trim()) return "State is required.";
  if (!postalCode.trim()) return "Postal code is required.";
  if (!country.trim()) return "Country is required.";

  const line1Regex = /^[A-Za-z0-9/, ]+$/;
  const lettersOnly = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
  const postalRegex = /^\d{6,7}$/;

  if (!line1Regex.test(line1)) return "Address line1 can include letters, numbers, / and comma.";
  if (!lettersOnly.test(city)) return "City must contain letters only.";
  if (!lettersOnly.test(district)) return "District must contain letters only.";
  if (!lettersOnly.test(state)) return "State must contain letters only.";
  if (!lettersOnly.test(country)) return "Country must contain letters only.";

  if (!postalRegex.test(postalCode)) return "Postal code must be 6 or 7 digits.";

  return null;
};

export const validateMobile = (mobile: string) => {
  const pattern = /^[0-9]{10}$/;
  if (!pattern.test(mobile)) return "Mobile must be 10 digits.";
  return null;
};

export const validateName = (name: string): string | null => {
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!name.trim()) return "Full name is required.";
  if (!nameRegex.test(name)) return "Name can only contain letters and spaces.";
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
  if (price === undefined || price < 40) return "Price must be 40 or more.";
  return null;
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Min 8 chars, at least one number
  return password.length >= 8 && /\d/.test(password);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};
export const validatePhone = (phone: string) => {
  return /^[6-9]\d{9}$/.test(phone);  
};

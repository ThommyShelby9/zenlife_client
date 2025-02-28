/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Get password strength (0-4)
 * 0: Very weak, 1: Weak, 2: Medium, 3: Strong, 4: Very strong
 */
export const getPasswordStrength = (password: string): number => {
  let strength = 0;

  if (password.length < 1) return strength;

  // Length check
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;

  // Character type checks
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[^a-zA-Z\d]/.test(password)) strength += 1;

  return Math.min(4, Math.floor(strength / 2));
};

/**
 * Get password strength label
 */
export const getPasswordStrengthLabel = (strength: number): string => {
  const labels = [
    'Très faible',
    'Faible',
    'Moyen',
    'Fort',
    'Très fort'
  ];

  return labels[strength];
};

/**
 * Validate username format
 */
export const isValidUsername = (username: string): boolean => {
  // 3-20 characters, alphanumeric, underscores, hyphens
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Validate currency amount format
 */
export const isValidCurrencyAmount = (amount: string): boolean => {
  // Allow positive numbers with up to two decimal places
  const amountRegex = /^\d+(\.\d{1,2})?$/;
  return amountRegex.test(amount);
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const isValidDateFormat = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  // Check if it's a valid date
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

/**
 * Validate time format (HH:MM)
 */
export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Validate phone number format
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  // This is a simple validation, you might want to use a library like libphonenumber-js
  // for more comprehensive validation
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phoneNumber);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

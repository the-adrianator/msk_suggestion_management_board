// Currency utility functions

/**
 * Format currency string (e.g., "85.00" -> "£85.00")
 */
export const formatCurrency = (amount: string | number): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(numericAmount);
};

/**
 * Parse currency string (e.g., "£85.00" -> "85.00")
 */
export const parseCurrency = (currencyString: string): string => {
  return currencyString.replace(/[£,]/g, '');
};

/**
 * Validate currency format
 */
export const isValidCurrency = (value: string): boolean => {
  const currencyRegex = /^£?\d+(\.\d{2})?$/;
  return currencyRegex.test(value);
};

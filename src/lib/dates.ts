// Date utility functions

/**
 * Get current ISO timestamp
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Check if a suggestion is overdue (pending for more than threshold days)
 */
export const isOverdue = (
  dateCreated: string,
  thresholdDays: number = 30
): boolean => {
  const created = new Date(dateCreated);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  return diffInDays > thresholdDays;
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Format date and time for display
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

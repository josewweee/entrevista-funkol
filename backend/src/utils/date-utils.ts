/**
 * Utility functions for handling dates in the backend
 */

/**
 * Convert a date to ISO string format
 * Always returns an ISO string for consistent storage
 */
export function toISOString(date: Date | string): string {
  if (date instanceof Date) {
    return date.toISOString();
  }

  // If it's already a string, ensure it's a valid date
  const parsedDate = new Date(date);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString();
  }

  // Fallback to current date if the string can't be parsed
  return new Date().toISOString();
}

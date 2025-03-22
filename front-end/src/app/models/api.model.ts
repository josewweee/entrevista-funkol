/**
 * Standard API response format used across all API endpoints
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
}

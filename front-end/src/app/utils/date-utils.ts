/**
 * Utility functions for date handling
 */

/**
 * Parse date strings in various formats to Date objects
 * Handles both ISO format and localized formats like "21 de marzo de 2025, 8:42:15 p.m. UTC-5"
 */
export function parseDate(dateValue: string | Date): Date {
  if (dateValue instanceof Date) {
    return dateValue;
  }

  // Try standard ISO format first
  let date = new Date(dateValue);

  // If date is invalid, try to handle localized format
  if (isNaN(date.getTime())) {
    try {
      // For localized formats like "21 de marzo de 2025, 8:42:15 p.m. UTC-5"
      const parts = dateValue.match(
        /(\d+)[^0-9]+(\w+)[^0-9]+(\d+)[^0-9]+(\d+)[^0-9]+(\d+)/
      );

      if (parts) {
        const months: { [key: string]: number } = {
          enero: 0,
          febrero: 1,
          marzo: 2,
          abril: 3,
          mayo: 4,
          junio: 5,
          julio: 6,
          agosto: 7,
          septiembre: 8,
          octubre: 9,
          noviembre: 10,
          diciembre: 11,
        };

        const day = parseInt(parts[1]);
        const month = months[parts[2].toLowerCase()];
        const year = parseInt(parts[3]);
        const hour = parseInt(parts[4]);
        let minute = parseInt(parts[5]);

        // Check if it's p.m. and adjust hours accordingly
        if (dateValue.toLowerCase().includes('p.m.') && hour < 12) {
          const adjustedHour = hour + 12;
          date = new Date(year, month, day, adjustedHour, minute);
        } else {
          date = new Date(year, month, day, hour, minute);
        }
      }
    } catch (e) {
      console.error('Error parsing date:', dateValue, e);
      // Fallback to current date if parsing fails
      date = new Date();
    }
  }

  return date;
}

/**
 * Convert a date to ISO string format
 * If the input is already a string, try to parse it first
 */
export function toISOString(dateValue: Date | string): string {
  if (typeof dateValue === 'string') {
    return parseDate(dateValue).toISOString();
  }
  return dateValue.toISOString();
}


'use client';

// Array of month names for parsing dates
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

/**
 * Checks if a given year is a leap year.
 * @param year The year to check.
 * @returns True if the year is a leap year, false otherwise.
 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Gets the number of days in a given year.
 * @param year The year to check.
 * @returns 366 for a leap year, 365 otherwise.
 */
function getDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

/**
 * Parses a date string into a fractional year value using UTC calculations
 * to ensure timezone independence and consistency.
 *
 * @param dateStr The date string to parse (e.g., "1970-02-13", "February 1970", "1970").
 * @returns A fractional year (e.g., 1970.118) or null if parsing fails.
 */
export function parseDateToFractionalYear(dateStr: string): number | null {
  if (!dateStr || typeof dateStr !== 'string') return null;

  const trimmedDateStr = dateStr.trim();

  // 1. Handle YYYY-MM-DD format (most reliable)
  const ymdMatch = trimmedDateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10);
    const day = parseInt(ymdMatch[3], 10);
    
    // Day of year calculation
    const startOfYear = Date.UTC(year, 0, 1); // Jan 1
    const targetDate = Date.UTC(year, month - 1, day);
    const dayOfYear = (targetDate - startOfYear) / (1000 * 60 * 60 * 24); // 0-indexed day of year

    return year + dayOfYear / getDaysInYear(year);
  }

  // 2. Handle "Month YYYY" format
  const monthYearMatch = trimmedDateStr.match(/(\w+)\s(\d{4})/);
  if (monthYearMatch) {
    const monthName = monthYearMatch[1];
    const year = parseInt(monthYearMatch[2], 10);
    const monthIndex = MONTH_NAMES.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
    
    if (monthIndex !== -1) {
      // Position in the middle of the month for better average accuracy
      return year + (monthIndex + 0.5) / 12;
    }
  }
  
  // 3. Handle "YYYY" format
  const yearMatch = trimmedDateStr.match(/^(\d{4})$/);
  if (yearMatch) {
    // Position at the very start of the year
    return parseInt(yearMatch[1], 10);
  }
  
  // Fallback for other potential date formats using Date.parse,
  // though it can be unreliable across timezones. Use as a last resort.
  const parsedDate = Date.parse(trimmedDateStr);
  if (!isNaN(parsedDate)) {
      const date = new Date(parsedDate);
      const year = date.getUTCFullYear();
      const startOfYear = Date.UTC(year, 0, 1);
      const dayOfYear = (date.getTime() - startOfYear) / (1000 * 60 * 60 * 24);
      return year + dayOfYear / getDaysInYear(year);
  }


  // Return null if no format matches
  console.warn(`Could not parse date: "${dateStr}"`);
  return null; 
}

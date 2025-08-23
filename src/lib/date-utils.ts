
'use client';

// Array of month names for parsing dates
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

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
    
    let dayOfYear = day;
    for (let i = 0; i < month - 1; i++) {
        dayOfYear += DAYS_IN_MONTH[i];
    }

    // Add a day for leap years if the date is after Feb 28th
    if (isLeapYear(year) && month > 2) {
        dayOfYear += 1;
    }
    
    // The fractional part is the 0-indexed day of year divided by total days.
    return year + (dayOfYear - 1) / getDaysInYear(year);
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
  
  console.warn(`Could not parse date: "${dateStr}"`);
  return null; 
}

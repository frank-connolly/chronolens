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
 * Parses a date string into a fractional year value.
 * This is the core logic for positioning items on the timeline.
 * It uses UTC to avoid timezone-related issues.
 *
 * @param dateStr The date string to parse (e.g., "1948", "December 1948", "1948-12-03").
 * @returns A fractional year (e.g., 1948.92) or null if parsing fails.
 */
export function parseDateToFractionalYear(dateStr: string): number | null {
  if (!dateStr) return null;

  // 1. Handle "Month YYYY" format (e.g., "December 1948")
  const monthYearMatch = dateStr.match(/(\w+)\s(\d{4})/);
  if (monthYearMatch) {
    const monthName = monthYearMatch[1];
    const year = parseInt(monthYearMatch[2], 10);
    const monthIndex = MONTH_NAMES.findIndex(m => m.toLowerCase().startsWith(monthName.toLowerCase()));
    
    if (monthIndex !== -1) {
      // Position the event in the middle of the month for better average accuracy.
      return year + (monthIndex + 0.5) / 12;
    }
  }

  // 2. Handle full dates or year-only formats using the Date object.
  // We construct a UTC date to ensure consistency across all clients.
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    // Make sure we are in UTC
    const utcDate = new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
    ));

    const year = utcDate.getUTCFullYear();
    
    // If the original string was just a year, position it at the start of the year.
    if (/^\d{4}$/.test(dateStr.trim())) {
        return year;
    }

    const startOfYear = new Date(Date.UTC(year, 0, 1));
    const dayOfYear = (utcDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
    const daysInYear = getDaysInYear(year);
    
    return year + dayOfYear / daysInYear;
  }

  return null; // Return null if no format matches
}

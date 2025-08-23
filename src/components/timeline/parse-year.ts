
'use client';

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function parseYear(dateStr: string): number | null {
    if (!dateStr) return null;

    // Attempt to parse full dates first using UTC to avoid timezone issues.
    const date = new Date(dateStr);
    if (!isNaN(date.getTime()) && dateStr.match(/[a-zA-Z]/) === null && dateStr.split(/[\s,-/]/).length > 1) {
      // It's a valid date that isn't just a year string
      const year = date.getUTCFullYear();
      const startOfYear = new Date(Date.UTC(year, 0, 1));
      const dayOfYear = (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
      const daysInYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
      return year + dayOfYear / daysInYear;
    }
  
    // Handle "Month YYYY" format
    const monthYearMatch = dateStr.match(/(\w+)\s(\d{4})/);
    if (monthYearMatch) {
      const monthName = monthYearMatch[1];
      const year = parseInt(monthYearMatch[2], 10);
      const monthIndex = MONTH_NAMES.findIndex(m => m.toLowerCase().startsWith(monthName.toLowerCase()));
      if (monthIndex !== -1) {
        // Position it in the middle of the month
        return year + (monthIndex + 0.5) / 12;
      }
    }
  
    // Handle "YYYY" as a fallback, position it at the start of the year
    const yearMatch = dateStr.match(/^\s*(\d{4})\s*$/);
    if (yearMatch) {
      return parseInt(yearMatch[1], 10);
    }
  
    return null;
}

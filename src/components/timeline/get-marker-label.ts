
'use client';

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}


export function getMarkerLabel(fractionalYear: number, type: 'year' | 'month' | 'day'): string {
  const year = Math.floor(fractionalYear);
  const remainder = fractionalYear - year;

  if (type === 'year') {
    return year.toString();
  }
  
  const daysInYear = getDaysInYear(year);
  const dayOfYear = Math.round(remainder * daysInYear);

  // Create a date object in UTC to avoid timezone issues.
  // Start with Jan 1st of the year and add the number of days.
  const date = new Date(Date.UTC(year, 0, 1));
  date.setUTCDate(date.getUTCDate() + dayOfYear);

  if (type === 'month') {
    return `${MONTH_NAMES[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  }

  if (type === 'day') {
    return `${MONTH_NAMES[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
  }

  return '';
}

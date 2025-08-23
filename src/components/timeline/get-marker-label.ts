
'use client';

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function getMarkerLabel(fractionalYear: number, type: 'year' | 'month' | 'day'): string {
  const year = Math.floor(fractionalYear);
  const remainder = fractionalYear - year;

  if (type === 'year') {
    return year.toString();
  }
  
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const daysInYear = isLeap ? 366 : 365;

  const dayOfYear = Math.floor(remainder * daysInYear);
  const date = new Date(year, 0, dayOfYear + 1); // +1 because day of year is 1-based

  if (type === 'month') {
    return `${MONTH_NAMES[date.getMonth()]} ${year}`;
  }

  if (type === 'day') {
    return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${year}`;
  }

  return '';
}

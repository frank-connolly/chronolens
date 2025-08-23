
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

  let dayOfYear = Math.round(remainder * daysInYear);
  if (dayOfYear >= daysInYear) {
      // This can happen due to floating point inaccuracies, clamp it.
      dayOfYear = daysInYear -1;
  }
  const date = new Date(Date.UTC(year, 0, dayOfYear + 1)); 

  if (type === 'month') {
    return `${MONTH_NAMES[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  }

  if (type === 'day') {
    return `${MONTH_NAMES[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
  }

  return '';
}

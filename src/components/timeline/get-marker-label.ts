'use client';

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function getMarkerLabel(fractionalYear: number, type: 'year' | 'month' | 'day'): string {
  const year = Math.floor(fractionalYear);
  const remainder = fractionalYear - year;
  
  if (type === 'year') {
    return year.toString();
  }

  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const daysInYear = isLeap ? 366 : 365;
  
  if (type === 'month') {
    const monthIndex = Math.floor(remainder * 12);
    return `${MONTH_NAMES[monthIndex] || ''} ${year}`;
  }
  
  if (type === 'day') {
    const dayOfYear = Math.round(remainder * daysInYear);
    const date = new Date(year, 0); // Start of the year
    date.setDate(dayOfYear + 1); // Add days
    const monthName = MONTH_NAMES[date.getMonth()];
    return `${monthName} ${date.getDate()}, ${year}`;
  }
  
  return '';
}

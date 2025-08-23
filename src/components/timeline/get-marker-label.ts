
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

  if (type === 'month') {
    const monthIndex = Math.floor(remainder * 12);
    // When zoomed out, month markers can fall on the same year. Only show year for the first month.
    if (Math.abs(remainder) < 0.01) {
      return year.toString();
    }
    return `${MONTH_NAMES[monthIndex] || ''}`;
  }

  if (type === 'day') {
    // Add 1 to day of year because we are using 1-based indexing for days
    const dayOfYear = Math.round(remainder * daysInYear) + 1;
    const date = new Date(year, 0, dayOfYear);
    const monthName = MONTH_NAMES[date.getMonth()];

    // When zoomed out, day markers can fall on the same month.
    // Only show month and year for the first day of the month.
    if (date.getDate() === 1) {
      return `${monthName} ${year}`;
    }
    return `${monthName} ${date.getDate()}`;
  }

  return '';
}

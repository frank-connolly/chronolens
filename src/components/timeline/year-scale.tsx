
'use client';

import { useMemo } from 'react';

interface YearScaleProps {
  minYear: number;
  maxYear: number;
  zoom: number;
  yAxisMultiplier: number;
}

const MIN_PX_PER_INTERVAL = 80; // Minimum pixels between markers

// Define marker types and intervals in years
const INTERVALS = [
  // Year intervals
  { value: 1000, type: 'year' },
  { value: 500, type: 'year' },
  { value: 250, type: 'year' },
  { value: 100, type: 'year' },
  { value: 50, type: 'year' },
  { value: 25, type: 'year' },
  { value: 10, type: 'year' },
  { value: 5, type: 'year' },
  { value: 2, type: 'year' },
  { value: 1, type: 'year' },
  // Month intervals (fractions of a year)
  { value: 1 / 2, type: 'month' }, // 6 months
  { value: 1 / 4, type: 'month' }, // 3 months
  { value: 1 / 12, type: 'month' }, // 1 month
  // Day intervals (fractions of a year)
  { value: 7 / 365.25, type: 'day' }, // 1 week
  { value: 1 / 365.25, type: 'day' }, // 1 day
];

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getMarkerLabel(fractionalYear: number, type: 'year' | 'month' | 'day'): string {
  const year = Math.floor(fractionalYear);
  const remainder = fractionalYear - year;
  
  if (type === 'year') {
    return year.toString();
  }

  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const daysInYear = isLeap ? 366 : 365;
  
  if (type === 'month') {
    const monthIndex = Math.floor(remainder * 12);
    // When zoomed out, month markers can fall on the same year. Only show year for first month.
    if (Math.abs(remainder) < 0.01) {
      return year.toString();
    }
    return `${MONTH_NAMES[monthIndex] || ''}`;
  }
  
  if (type === 'day') {
    const dayOfYear = Math.round(remainder * daysInYear);
    const date = new Date(year, 0); // Start of the year
    date.setDate(dayOfYear + 1); // Add days
    const monthName = MONTH_NAMES[date.getMonth()];
    // When zoomed out, day markers can fall on the same month. Only show month for first day.
     if (date.getDate() === 1 && date.getHours() < 1) { // Check if it's the first day of the month.
       return `${monthName} ${year}`;
    }
    return `${monthName} ${date.getDate()}`;
  }
  
  return '';
}

export default function YearScale({ minYear, maxYear, zoom, yAxisMultiplier }: YearScaleProps) {
  const markers = useMemo(() => {
    const pixelsPerYear = yAxisMultiplier * zoom;
    if (pixelsPerYear <= 0) return [];
    
    const idealInterval = MIN_PX_PER_INTERVAL / pixelsPerYear;
    
    // Find the best interval from our predefined list
    const bestInterval = INTERVALS.find(i => i.value >= idealInterval) || INTERVALS[INTERVALS.length - 1];
    
    const yearMarkers: { value: number; label: string }[] = [];
    const { value: interval, type } = bestInterval;

    const startYear = Math.ceil(minYear / interval) * interval;

    for (let year = startYear; year <= maxYear; year += interval) {
      // Avoid floating point inaccuracies by rounding to a high precision
      const roundedYear = parseFloat(year.toPrecision(12));
      if (roundedYear < minYear) continue;

      yearMarkers.push({
        value: roundedYear,
        label: getMarkerLabel(roundedYear, type),
      });
    }
    return yearMarkers;
  }, [minYear, maxYear, zoom, yAxisMultiplier]);

  return (
    <div className="relative w-20 text-right shrink-0">
      {markers.map(({ value, label }) => {
        const top = (value - minYear) * yAxisMultiplier * zoom;
        return (
          <div
            key={value}
            className="absolute right-4 text-sm text-muted-foreground font-code -translate-y-1/2"
            style={{ top: `${top}px` }}
          >
            <span className="bg-background px-1">{label}</span>
            <div className="absolute top-1/2 -translate-y-1/2 right-[-1rem] w-2 h-px bg-border"></div>
          </div>
        );
      })}
    </div>
  );
}

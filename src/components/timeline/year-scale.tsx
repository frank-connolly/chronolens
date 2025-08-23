
'use client';

import { useMemo } from 'react';
import { getMarkerLabel } from './get-marker-label';

interface YearScaleProps {
  minYear: number;
  maxYear: number;
  zoom: number;
  yAxisMultiplier: number;
}

const MIN_PX_PER_INTERVAL = 80; // Minimum pixels between markers

// Define marker types and intervals in years
const INTERVALS = [
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
  { value: 1 / 2, type: 'month' }, // 6 months
  { value: 1 / 4, type: 'month' }, // 3 months
  { value: 1 / 12, type: 'month' }, // 1 month
  { value: 7 / 365.25, type: 'day' }, // 1 week
  { value: 1 / 365.25, type: 'day' }, // 1 day
];


export default function YearScale({ minYear, maxYear, zoom, yAxisMultiplier }: YearScaleProps) {
  const markers = useMemo(() => {
    const pixelsPerYear = yAxisMultiplier * zoom;
    if (pixelsPerYear <= 0) return [];

    // Determine the ideal spacing in years based on the minimum pixel separation
    const idealIntervalInYears = MIN_PX_PER_INTERVAL / pixelsPerYear;
    
    // Find the best-fitting interval from our predefined list
    const bestInterval = INTERVALS.find(i => i.value >= idealIntervalInYears) || INTERVALS[INTERVALS.length - 1];
    
    const yearMarkers: { value: number; label: string }[] = [];
    const { value: interval, type } = bestInterval;

    // Calculate the first marker that should appear on the scale
    const startYear = Math.ceil(minYear / interval) * interval;

    for (let year = startYear; year <= maxYear; year += interval) {
      // Avoid floating point inaccuracies by rounding to a high precision
      const roundedYear = parseFloat(year.toPrecision(12));

      // Ensure the marker is within the visible range
      if (roundedYear < minYear) continue;

      yearMarkers.push({
        value: roundedYear,
        label: getMarkerLabel(roundedYear, type),
      });
    }
    return yearMarkers;
  }, [minYear, maxYear, zoom, yAxisMultiplier]);

  return (
    <div className="relative w-24 text-right shrink-0">
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

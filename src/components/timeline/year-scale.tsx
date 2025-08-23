'use client';

import { useMemo } from 'react';

interface YearScaleProps {
  minYear: number;
  maxYear: number;
  zoom: number;
  yAxisMultiplier: number;
}

export default function YearScale({ minYear, maxYear, zoom, yAxisMultiplier }: YearScaleProps) {
  const years = useMemo(() => {
    const range = maxYear - minYear;
    let interval = 100;
    if (range / (100 * zoom) < 5) interval = 50;
    if (range / (50 * zoom) < 5) interval = 25;
    if (range / (25 * zoom) < 5) interval = 10;
    if (range / (10 * zoom) < 5) interval = 5;
    if (range / (5 * zoom) < 5) interval = 1;

    const startYear = Math.ceil(minYear / interval) * interval;
    const yearMarkers = [];
    for (let year = startYear; year <= maxYear; year += interval) {
      yearMarkers.push(year);
    }
    return yearMarkers;
  }, [minYear, maxYear, zoom]);

  return (
    <div className="relative w-16 text-right shrink-0">
      {years.map((year) => {
        const top = (year - minYear) * yAxisMultiplier * zoom;
        return (
          <div
            key={year}
            className="absolute right-4 text-sm text-muted-foreground font-code"
            style={{ top: `${top}px` }}
          >
            <span className="bg-background px-1">{year}</span>
            <div className="absolute top-1/2 -translate-y-1/2 right-[-1rem] w-2 h-px bg-border"></div>
          </div>
        );
      })}
    </div>
  );
}

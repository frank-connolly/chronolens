'use client';

import { useMemo } from 'react';

interface YearScaleProps {
  minYear: number;
  maxYear: number;
  zoom: number;
  yAxisMultiplier: number;
}

const MIN_PX_PER_INTERVAL = 80;

export default function YearScale({ minYear, maxYear, zoom, yAxisMultiplier }: YearScaleProps) {
  const years = useMemo(() => {
    const range = maxYear - minYear;
    const possibleIntervals = [1000, 500, 250, 100, 50, 25, 10, 5, 2, 1, 0.5, 0.25, 0.1];
    
    const idealInterval = MIN_PX_PER_INTERVAL / (yAxisMultiplier * zoom);

    let interval = possibleIntervals[0];
    for (const p of possibleIntervals) {
      if (p < idealInterval) {
        interval = p;
        break;
      }
    }
    
    // Fallback for very high zoom
    if (idealInterval < possibleIntervals[possibleIntervals.length -1]) {
        interval = possibleIntervals[possibleIntervals.length -1];
    }


    const startYear = Math.ceil(minYear / interval) * interval;
    const yearMarkers: number[] = [];
    for (let year = startYear; year <= maxYear; year += interval) {
      yearMarkers.push(year);
    }
    return yearMarkers;
  }, [minYear, maxYear, zoom, yAxisMultiplier]);

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
            <span className="bg-background px-1">{Number.isInteger(year) ? year : year.toFixed(2)}</span>
            <div className="absolute top-1/2 -translate-y-1/2 right-[-1rem] w-2 h-px bg-border"></div>
          </div>
        );
      })}
    </div>
  );
}

'use client';

import { useMemo } from 'react';

interface YearScaleProps {
  minYear: number;
  maxYear: number;
  zoom: number;
  yAxisMultiplier: number;
}

const MIN_PX_BETWEEN_MARKERS = 60;

export default function YearScale({ minYear, maxYear, zoom, yAxisMultiplier }: YearScaleProps) {
  const yearMarkers = useMemo(() => {
    const pixelsPerYear = yAxisMultiplier * zoom;
    if (pixelsPerYear <= 0) return [];

    let interval = 1;
    if (pixelsPerYear < MIN_PX_BETWEEN_MARKERS) {
      const intervals = [5, 10, 25, 50, 100, 250, 500, 1000];
      for (const i of intervals) {
        if (pixelsPerYear * i >= MIN_PX_BETWEEN_MARKERS) {
          interval = i;
          break;
        }
      }
      if (pixelsPerYear * interval < MIN_PX_BETWEEN_MARKERS) {
          interval = 1000;
      }
    }

    const markers = [];
    const startYear = Math.ceil(minYear / interval) * interval;

    for (let year = startYear; year <= maxYear; year += interval) {
      markers.push(Math.round(year));
    }
    return markers;
  }, [minYear, maxYear, zoom, yAxisMultiplier]);

  return (
    <div className="relative w-24 text-right shrink-0">
      {yearMarkers.map((year) => {
        const top = (year - minYear) * yAxisMultiplier * zoom;
        return (
          <div
            key={year}
            className="absolute right-4 text-sm text-muted-foreground font-code -translate-y-1/2"
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

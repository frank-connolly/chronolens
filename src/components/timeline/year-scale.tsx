'use client';

import { useMemo } from 'react';
import { getMarkerLabel } from './get-marker-label';

interface YearScaleProps {
  minYear: number;
  maxYear: number;
  zoom: number;
  yAxisMultiplier: number;
  cursorYear: number | null;
}

const MIN_PX_BETWEEN_MARKERS = 60;

export default function YearScale({ minYear, maxYear, zoom, yAxisMultiplier, cursorYear }: YearScaleProps) {
  const yearMarkers = useMemo(() => {
    const pixelsPerYear = yAxisMultiplier * zoom;
    if (pixelsPerYear <= 0) return [];

    let interval = 1;
    const intervals = [1, 5, 10, 25, 50, 100, 250, 500, 1000];
    
    let bestInterval = intervals[intervals.length - 1];
    for (const i of intervals) {
        if (pixelsPerYear * i >= MIN_PX_BETWEEN_MARKERS) {
            bestInterval = i;
            break;
        }
    }
    interval = bestInterval;

    const markers = [];
    const startYear = Math.ceil(minYear / interval) * interval;

    for (let year = startYear; year <= maxYear; year += interval) {
      markers.push(Math.round(year));
    }
    return markers;
  }, [minYear, maxYear, zoom, yAxisMultiplier]);

  const cursorLabel = cursorYear !== null ? getMarkerLabel(cursorYear, 'day') : '';

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

      {cursorYear !== null && (
        <div
          className="absolute right-0 -translate-y-1/2 transition-opacity duration-100"
          style={{ top: `${(cursorYear - minYear) * yAxisMultiplier * zoom}px` }}
        >
            <div className="relative">
                 <div className="absolute right-4">
                    <span className="bg-accent text-accent-foreground text-xs font-code px-2 py-0.5 rounded">
                        {cursorLabel}
                    </span>
                 </div>
                 <div className="absolute top-1/2 -translate-y-1/2 right-[-1rem] w-4 h-px bg-accent"></div>
            </div>
        </div>
      )}
    </div>
  );
}

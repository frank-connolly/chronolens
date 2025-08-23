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

    const intervals = [1000, 500, 250, 100, 50, 25, 10, 5, 1, 0.5, 0.25, 0.1];
    let interval = 1;

    for (const i of intervals) {
      if (i * pixelsPerYear >= MIN_PX_BETWEEN_MARKERS) {
        interval = i;
      }
    }
    
    if(interval < 1) { // monthly or daily markers
        const pixelsPerDay = pixelsPerYear / 365.25;
        if(pixelsPerDay * 90 >= MIN_PX_BETWEEN_MARKERS) {
            // quarterly would be nice
        } else if (pixelsPerDay * 30 >= MIN_PX_BETWEEN_MARKERS) {
            // monthly
        }
        // for now just stick to years
    }


    const markers = [];
    const start = Math.ceil(minYear / interval) * interval;

    for (let year = start; year <= maxYear; year += interval) {
      if(year >= minYear){
        markers.push(Math.round(year));
      }
    }
    return markers;
  }, [minYear, maxYear, zoom, yAxisMultiplier]);

  const cursorLabel = cursorYear !== null ? getMarkerLabel(cursorYear, 'month') : '';

  return (
    <div className="relative w-24 text-right shrink-0">
      <div className="absolute top-0 right-4 bottom-0 w-px bg-border -z-10" />

      {yearMarkers.map((year) => {
        const top = (year - minYear) * yAxisMultiplier * zoom;
        return (
          <div
            key={year}
            className="absolute right-0 -translate-y-1/2"
            style={{ top: `${top}px` }}
          >
            <span className="text-sm text-muted-foreground font-code bg-background pr-2">{year}</span>
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-2 h-px bg-border"></div>
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

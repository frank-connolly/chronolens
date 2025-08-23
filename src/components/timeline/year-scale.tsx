
'use client';

import { useMemo } from 'react';
import { getMarkerLabel } from './get-marker-label';

interface YearScaleProps {
  minYear: number;
  zoom: number;
  yAxisMultiplier: number;
  cursorYear: number | null;
  yearMarkers: number[];
}

export default function YearScale({ minYear, zoom, yAxisMultiplier, cursorYear, yearMarkers }: YearScaleProps) {
  const cursorLabel = useMemo(() => {
    if (cursorYear === null) return '';
    // Determine the most appropriate label based on zoom level.
    const pixelsPerYear = yAxisMultiplier * zoom;
    if (pixelsPerYear > 365 * 2) { // arbitrary threshold for showing days
        return getMarkerLabel(cursorYear, 'day');
    }
    return getMarkerLabel(cursorYear, 'month');
  }, [cursorYear, zoom, yAxisMultiplier]);

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

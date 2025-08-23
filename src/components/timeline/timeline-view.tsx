
'use client';

import { useMemo, useState } from 'react';
import type { Timeline } from '@/types';
import TimelineColumn from './timeline-column';
import YearScale from './year-scale';
import CursorIndicator from './cursor-indicator';
import { Frown } from 'lucide-react';
import { getMarkerLabel } from './get-marker-label';

interface TimelineViewProps {
  timelines: Timeline[];
  zoom: number;
  onRemoveTimeline: (id: string) => void;
}

const Y_AXIS_MULTIPLIER = 100; // pixels per year at zoom level 1
const MIN_PX_BETWEEN_MARKERS = 60;


const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const parseYear = (dateStr: string): number | null => {
    if (!dateStr) return null;
    const trimmedDate = dateStr.trim();

    // Handles "Month YYYY" format (e.g., "December 1948")
    const monthYearMatch = trimmedDate.match(
      new RegExp(`^(${MONTHS.join('|')})\\s+(\\d{4})$`, 'i')
    );
    if (monthYearMatch) {
        const monthName = monthYearMatch[1];
        const year = parseInt(monthYearMatch[2], 10);
        const monthIndex = MONTHS.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
        if (monthIndex !== -1) {
            // Mid-month approximation
            return year + ((monthIndex + 0.5) / 12);
        }
    }

    // Handles "YYYY" format
    if (/^\d{4}$/.test(trimmedDate)) {
        return parseInt(trimmedDate, 10);
    }
    
    // Fallback for full dates using UTC
    const date = new Date(trimmedDate);
    if (!isNaN(date.getTime())) {
        const year = date.getUTCFullYear();
        const startOfYear = Date.UTC(year, 0, 1);
        const endOfYear = Date.UTC(year + 1, 0, 1);
        const totalTimeInYear = endOfYear - startOfYear;
        const timeFromStart = date.getTime() - startOfYear;

        if (totalTimeInYear > 0) {
            return year + (timeFromStart / totalTimeInYear);
        }
        return year;
    }

    // Final fallback for formats like "c. 1950" or other unparseable strings.
    const fallbackYearMatch = trimmedDate.match(/\b(\d{4})\b/);
    return fallbackYearMatch ? parseInt(fallbackYearMatch[0], 10) : null;
};



export default function TimelineView({ timelines, zoom, onRemoveTimeline }: TimelineViewProps) {
  const [minYear, maxYear] = useMemo(() => {
    let min: number | null = null;
    let max: number | null = null;
    timelines.forEach(timeline => {
      timeline.events.forEach(event => {
        const year = parseYear(event.date);
        if (year !== null) {
          if (min === null || year < min) min = year;
          if (max === null || year > max) max = year;
        }
      });
    });
    if (min !== null && max !== null) {
      const padding = (max - min) * 0.05 || 5;
      return [min - padding, max + padding];
    }
    return [1990, 2030];
  }, [timelines]);

  const yearMarkers = useMemo(() => {
    const pixelsPerYear = Y_AXIS_MULTIPLIER * zoom;
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
        markers.push(year);
      }
    }
    return markers;
  }, [minYear, maxYear, zoom]);

  const [cursorY, setCursorY] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollTop = e.currentTarget.scrollTop;
    const style = window.getComputedStyle(e.currentTarget);
    const paddingTop = parseFloat(style.paddingTop);
    setCursorY(e.clientY - rect.top + scrollTop - paddingTop);
  };

  const handleMouseLeave = () => {
    setCursorY(null);
  };

  if (timelines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
        <Frown className="h-24 w-24 mb-4" />
        <h2 className="text-2xl font-headline">Nothing to see here... yet.</h2>
        <p className="mt-2 max-w-md">Use the search bar above to add a timeline for a person, country, or historical event to begin your journey through time.</p>
      </div>
    );
  }

  const totalHeight = (maxYear - minYear) * Y_AXIS_MULTIPLIER * zoom;
  const pixelsPerYear = Y_AXIS_MULTIPLIER * zoom;
  const cursorYear = cursorY !== null ? minYear + cursorY / pixelsPerYear : null;


  return (
    <div 
      className="relative w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
       {cursorY !== null && cursorYear !== null && (
         <CursorIndicator
            top={cursorY}
        />
      )}
      <div className="flex gap-8 h-full p-8">
        <YearScale
          minYear={minYear}
          maxYear={maxYear}
          zoom={zoom}
          yAxisMultiplier={Y_AXIS_MULTIPLIER}
          cursorYear={cursorYear}
          yearMarkers={yearMarkers}
        />
        <div 
          className="relative flex-1 flex gap-8 h-full"
          style={{ height: `${totalHeight}px` }}
        >
           {/* Background Year Lines */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
            {yearMarkers.map((year) => {
              const top = (year - minYear) * Y_AXIS_MULTIPLIER * zoom;
              return (
                <div
                  key={`line-${year}`}
                  className="absolute w-full h-px bg-border/50"
                  style={{ top: `${top}px` }}
                />
              );
            })}
          </div>

          {timelines.map((timeline) => (
            <TimelineColumn
              key={timeline.id}
              timeline={timeline}
              minYear={minYear}
              zoom={zoom}
              yAxisMultiplier={Y_AXIS_MULTIPLIER}
              parseYear={parseYear}
              onRemove={() => onRemoveTimeline(timeline.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

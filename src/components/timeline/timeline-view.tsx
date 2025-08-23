'use client';

import { useMemo, useState } from 'react';
import type { Timeline } from '@/types';
import TimelineColumn from './timeline-column';
import YearScale from './year-scale';
import CursorIndicator from './cursor-indicator';
import { Frown } from 'lucide-react';

interface TimelineViewProps {
  timelines: Timeline[];
  zoom: number;
  onRemoveTimeline: (id: string) => void;
}

const Y_AXIS_MULTIPLIER = 20; // pixels per year at zoom level 1

/**
 * Parses a date string into a fractional year.
 * Handles "YYYY", "Month YYYY", "Month Day, YYYY".
 * Returns null if parsing fails.
 */
const parseYear = (dateStr: string): number | null => {
  if (!dateStr) return null;

  const date = new Date(dateStr);
  
  // Check for invalid date strings that the Date constructor might interpret loosely
  const justYearMatch = dateStr.match(/^\s*(-?\d{1,4})\s*$/);
  if (justYearMatch) {
      return parseInt(justYearMatch[1], 10);
  }

  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);
    const totalDaysInYear = (endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
    
    // Check if the original string was just a year, which can be parsed ambiguously.
    // e.g. new Date('1990') can result in a date in 1989 in some timezones.
    // If it looks like just a year, trust the regex match above if it existed.
    // Otherwise, for full dates, the Date object is more reliable.
    const dateStringHasDayAndMonth = /\w+\s+\d+,?\s+\d{4}/.test(dateStr) || /\d{4}-\d{2}-\d{2}/.test(dateStr);

    if (dateStringHasDayAndMonth) {
       const dayOfYear = (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24);
       return year + dayOfYear / totalDaysInYear;
    }

    // Handle month and year dates
    const month = date.getMonth();
    return year + month / 12;
  }
  
  // Fallback for just year "YYYY" format that Date might misinterpret
  const match = dateStr.match(/\b-?\d{3,4}\b/);
  const year = match ? parseInt(match[0], 10) : null;
  return year && !isNaN(year) ? year : null;
}

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
      // Ensure min and max are at least 1 year apart for padding
      if (max - min < 1) {
        max = min + 1;
      }
      const padding = Math.max((max - min) * 0.05, 0.1);
      return [min - padding, max + padding];
    }
    return [1900, 2025];
  }, [timelines]);

  const [cursorY, setCursorY] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorY(e.clientY - rect.top);
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
      className="relative w-full h-full p-8"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex gap-8 h-full">
        <YearScale
          minYear={minYear}
          maxYear={maxYear}
          zoom={zoom}
          yAxisMultiplier={Y_AXIS_MULTIPLIER}
        />
        <div 
          className="flex-1 flex gap-8 h-full"
          style={{ height: `${totalHeight}px` }}
        >
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
      {cursorY !== null && cursorYear !== null && (
         <CursorIndicator
            top={cursorY}
            year={cursorYear}
        />
      )}
    </div>
  );
}

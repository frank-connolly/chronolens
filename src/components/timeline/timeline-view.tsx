'use client';

import { useMemo } from 'react';
import type { Timeline } from '@/types';
import TimelineColumn from './timeline-column';
import YearScale from './year-scale';
import { Frown } from 'lucide-react';

interface TimelineViewProps {
  timelines: Timeline[];
  zoom: number;
}

const Y_AXIS_MULTIPLIER = 20; // pixels per year at zoom level 1

const parseYear = (dateStr: string): number | null => {
  if (!dateStr) return null;
  const match = dateStr.match(/\b\d{3,4}\b/);
  const year = match ? parseInt(match[0], 10) : null;
  return year && !isNaN(year) ? year : null;
}

export default function TimelineView({ timelines, zoom }: TimelineViewProps) {
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
      const padding = Math.ceil((max - min) * 0.05);
      return [min - padding, max + padding];
    }
    return [1900, 2025];
  }, [timelines]);

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

  return (
    <div className="relative w-full h-full p-8">
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
          {timelines.map((timeline, index) => (
            <TimelineColumn
              key={timeline.id}
              timeline={timeline}
              minYear={minYear}
              zoom={zoom}
              yAxisMultiplier={Y_AXIS_MULTIPLIER}
              parseYear={parseYear}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

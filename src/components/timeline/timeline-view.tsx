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
  onReorderTimelines: (sourceIndex: number, destinationIndex: number) => void;
}

const Y_AXIS_MULTIPLIER = 100; // pixels per year at zoom level 1

const parseYear = (dateStr: string): number | null => {
  if (!dateStr) return null;
  
  // Try to match formats like "YYYY", "Month YYYY", "Month Day, YYYY"
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const timeDiff = date.getTime() - startOfYear.getTime();
    // Check if it's a leap year
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const daysInYear = isLeap ? 366 : 365;
    const dayOfYear = timeDiff / (1000 * 60 * 60 * 24);
    return year + dayOfYear / daysInYear;
  }
  
  // Fallback for just a year
  const yearMatch = dateStr.match(/\b\d{4}\b/);
  return yearMatch ? parseInt(yearMatch[0], 10) : null;
};


export default function TimelineView({ timelines, zoom, onRemoveTimeline, onReorderTimelines }: TimelineViewProps) {
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

  const [cursorY, setCursorY] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorY(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    setCursorY(null);
  };
  
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    onReorderTimelines(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
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
       {cursorY !== null && cursorYear !== null && (
         <CursorIndicator
            top={cursorY}
        />
      )}
      <div className="flex gap-8 h-full">
        <YearScale
          minYear={minYear}
          maxYear={maxYear}
          zoom={zoom}
          yAxisMultiplier={Y_AXIS_MULTIPLIER}
          cursorYear={cursorYear}
        />
        <div 
          className="flex-1 flex gap-8 h-full"
          style={{ height: `${totalHeight}px` }}
        >
          {timelines.map((timeline, index) => (
            <div
              key={timeline.id}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={draggedIndex === index ? 'opacity-50' : ''}
            >
              <TimelineColumn
                timeline={timeline}
                minYear={minYear}
                zoom={zoom}
                yAxisMultiplier={Y_AXIS_MULTIPLIER}
                parseYear={parseYear}
                onRemove={() => onRemoveTimeline(timeline.id)}
                onDragStart={() => handleDragStart(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


'use client';

import React, { useMemo, useState, useRef } from 'react';
import type { Timeline, TimelineEvent } from '@/types';
import TimelineColumn from './timeline-column';
import YearScale from './year-scale';
import CursorIndicator from './cursor-indicator';
import { Frown } from 'lucide-react';
import { getMarkerLabel } from './get-marker-label';
import { parseDateToFractionalYear } from '@/lib/date-utils';

interface TimelineViewProps {
  timelines: Timeline[];
  zoom: number;
  onRemoveTimeline: (id: string) => void;
}

const Y_AXIS_MULTIPLIER = 100; // pixels per year at zoom level 1
const MIN_PX_BETWEEN_MARKERS = 60;

// A new type that includes the calculated year for positioning
type PositionedTimelineEvent = TimelineEvent & { fractionalYear: number | null };
type PositionedTimeline = Omit<Timeline, 'events'> & { events: PositionedTimelineEvent[] };

export default function TimelineView({ timelines, zoom, onRemoveTimeline }: TimelineViewProps) {
  const mainRef = useRef<HTMLDivElement>(null);
  const [cursorY, setCursorY] = useState<number | null>(null);

  // Memoize the positioned timelines to avoid recalculating on every render
  const positionedTimelines: PositionedTimeline[] = useMemo(() => {
    return timelines.map(timeline => ({
      ...timeline,
      events: timeline.events.map(event => ({
        ...event,
        fractionalYear: parseDateToFractionalYear(event.date),
      })),
    }));
  }, [timelines]);
  
  const [minYear, maxYear] = useMemo(() => {
    let min: number | null = null;
    let max: number | null = null;
    positionedTimelines.forEach(timeline => {
      timeline.events.forEach(event => {
        if (event.fractionalYear !== null) {
          if (min === null || event.fractionalYear < min) min = event.fractionalYear;
          if (max === null || event.fractionalYear > max) max = event.fractionalYear;
        }
      });
    });
    if (min !== null && max !== null) {
      const padding = (max - min) * 0.05 || 5;
      return [min - padding, max + padding];
    }
    return [1990, 2030];
  }, [positionedTimelines]);
  
  const yearMarkers = useMemo(() => {
    const pixelsPerYear = Y_AXIS_MULTIPLIER * zoom;
    if (pixelsPerYear <= 0) return [];

    const intervals = [1000, 500, 250, 100, 50, 25, 10, 5, 1];
    let interval = 1;

    for (const i of intervals) {
      if (i * pixelsPerYear >= MIN_PX_BETWEEN_MARKERS) {
        interval = i;
      }
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

  const cursorYear = useMemo(() => {
    if (cursorY === null || !mainRef.current) return null;
    const scrollTop = mainRef.current.scrollTop;
    return minYear + (cursorY + scrollTop) / (Y_AXIS_MULTIPLIER * zoom);
  }, [cursorY, minYear, zoom]);


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const paddingTop = parseInt(window.getComputedStyle(e.currentTarget).paddingTop, 10);
    setCursorY(e.clientY - rect.top - paddingTop);
  };

  const handleMouseLeave = () => {
    setCursorY(null);
  };

  const totalHeight = (maxYear - minYear) * Y_AXIS_MULTIPLIER * zoom;
  
  // This must come after the state and refs are declared
  if (timelines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
        <Frown className="h-24 w-24 mb-4" />
        <h2 className="text-2xl font-headline">Nothing to see here... yet.</h2>
        <p className="mt-2 max-w-md">Use the search bar above to add a timeline for a person, country, or historical event to begin your journey through time.</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={mainRef}
    >
       {cursorY !== null && cursorYear !== null && mainRef.current && (
         <CursorIndicator
            top={cursorY + mainRef.current.scrollTop}
        />
      )}
      <div className="flex gap-8 h-full p-8">
        <YearScale
          minYear={minYear}
          zoom={zoom}
          yAxisMultiplier={Y_AXIS_MULTIPLIER}
          cursorYear={cursorYear}
          yearMarkers={yearMarkers}
        />
        <div 
          className="relative flex-1 flex gap-8"
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

          {positionedTimelines.map((timeline) => (
            <TimelineColumn
              key={timeline.id}
              timeline={timeline}
              minYear={minYear}
              zoom={zoom}
              yAxisMultiplier={Y_AXIS_MULTIPLIER}
              onRemove={() => onRemoveTimeline(timeline.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

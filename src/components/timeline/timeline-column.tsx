'use client';

import type { Timeline } from '@/types';
import TimelineEventCard from './timeline-event-card';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface TimelineColumnProps {
  timeline: Timeline;
  minYear: number;
  zoom: number;
  yAxisMultiplier: number;
  parseYear: (dateStr: string) => number | null;
  onRemove: () => void;
}

const CARD_SPACING = 16; // 1rem
const ESTIMATED_CARD_HEIGHT = 80; // Estimated height for an unexpanded card

export default function TimelineColumn({
  timeline,
  minYear,
  zoom,
  yAxisMultiplier,
  parseYear,
  onRemove,
}: TimelineColumnProps) {
  const lastPosition: { left: number; right: number } = {
    left: -Infinity,
    right: -Infinity,
  };

  const sortedEvents = [...timeline.events]
    .map(event => ({ ...event, year: parseYear(event.date) }))
    .filter(event => event.year !== null)
    .sort((a, b) => (a.year as number) - (b.year as number));

  const renderedElements: React.ReactNode[] = [];
  
  sortedEvents.forEach((event, index) => {
    const year = event.year as number;
    const side = index % 2 === 0 ? 'left' : 'right';

    const idealTop = (year - minYear) * yAxisMultiplier * zoom;

    // Check for overlap and adjust position
    const lastCardBottom = lastPosition[side];
    let currentTop = Math.max(idealTop, lastCardBottom + CARD_SPACING);

    lastPosition[side] = currentTop + ESTIMATED_CARD_HEIGHT;

    renderedElements.push(
      <TimelineEventCard
        key={`${timeline.id}-${index}`}
        event={event}
        top={currentTop}
        side={side}
      />
    );
  });


  return (
    <div className="relative w-80 shrink-0 h-full">
      <div className="sticky top-0 z-10 py-4 bg-background/80 backdrop-blur-sm -mt-8 pt-8">
        <div className="relative text-accent-foreground bg-accent p-2 rounded-lg shadow">
           <h2 className="text-xl font-headline font-bold text-center pr-8">
            {timeline.title}
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-accent-foreground hover:bg-accent/50 hover:text-accent-foreground"
            onClick={onRemove}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Vertical Line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-0.5 bg-border -z-10" />

      <div className="relative h-full">{renderedElements}</div>
    </div>
  );
}

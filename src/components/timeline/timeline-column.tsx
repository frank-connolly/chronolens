
'use client';

import type { TimelineEvent } from '@/types';
import TimelineEventCard from './timeline-event-card';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

// A new type that includes the calculated year for positioning
type PositionedTimelineEvent = TimelineEvent & { fractionalYear: number | null };
interface PositionedTimeline {
  id: string;
  title: string;
  events: PositionedTimelineEvent[];
}

interface TimelineColumnProps {
  timeline: PositionedTimeline;
  minYear: number;
  zoom: number;
  yAxisMultiplier: number;
  onRemove: () => void;
}

export default function TimelineColumn({
  timeline,
  minYear,
  zoom,
  yAxisMultiplier,
  onRemove,
}: TimelineColumnProps) {

  const sortedEvents = [...timeline.events]
    .filter(event => event.fractionalYear !== null)
    .sort((a, b) => (a.fractionalYear as number) - (b.fractionalYear as number));

  return (
    <div className="relative w-80 shrink-0 h-full">
      <div 
        className="sticky top-0 z-10 py-4 bg-background/80 backdrop-blur-sm -mt-8 pt-8"
      >
        <div className="relative text-accent-foreground bg-accent p-2 rounded-lg shadow">
           <h2 className="text-xl font-headline font-bold text-center">
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

      <div className="relative h-full">
        {sortedEvents.map((event, index) => {
          const year = event.fractionalYear as number;
          const side = index % 2 === 0 ? 'left' : 'right';
          const top = (year - minYear) * yAxisMultiplier * zoom;

          return (
            <TimelineEventCard
              key={`${timeline.id}-${index}`}
              event={event}
              top={top}
              side={side}
            />
          );
        })}
      </div>
    </div>
  );
}

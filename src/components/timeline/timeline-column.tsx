
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

  return (
    <div className="relative w-80 shrink-0 h-full">
      {/* Sticky Header for the title */}
       <div 
        className="sticky top-0 z-20 py-4 bg-background/80 backdrop-blur-sm -mt-8 pt-8"
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

      {/* This container establishes the positioning context for the line and cards */}
      <div className="relative h-full">
        {/* Vertical Line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-border" />
        
        {/* Event Cards Container */}
        <div className="relative">
          {timeline.events.map((event, index) => {
            if (event.fractionalYear === null) return null;

            const year = event.fractionalYear;
            const side = index % 2 === 0 ? 'left' : 'right';
            const top = (year - minYear) * yAxisMultiplier * zoom;

            return (
              <TimelineEventCard
                key={`${timeline.id}-${event.date}-${index}`}
                event={event}
                top={top}
                side={side}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

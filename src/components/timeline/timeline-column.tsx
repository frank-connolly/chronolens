
'use client';

import type { TimelineEvent } from '@/types';
import TimelineEventCard from './timeline-event-card';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { useMemo } from 'react';
import { parseDateToFractionalYear } from '@/lib/date-utils';

type PositionedTimelineEvent = TimelineEvent & { fractionalYear: number | null };

interface TimelineColumnProps {
  timeline: {
    id: string;
    title: string;
    events: TimelineEvent[];
  };
  minYear: number;
  zoom: number;
  yAxisMultiplier: number;
  onRemove: () => void;
}

// Estimated height for a collapsed card + margin
const ESTIMATED_CARD_HEIGHT = 90; // 74px card height + 16px margin

export default function TimelineColumn({
  timeline,
  minYear,
  zoom,
  yAxisMultiplier,
  onRemove,
}: TimelineColumnProps) {

  const positionedEvents = useMemo(() => {
    const eventsWithFractionalYear: PositionedTimelineEvent[] = timeline.events.map(event => ({
      ...event,
      fractionalYear: parseDateToFractionalYear(event.date),
    })).filter(e => e.fractionalYear !== null);

    const sortedEvents = eventsWithFractionalYear
      .sort((a, b) => a.fractionalYear! - b.fractionalYear!);

    let lastCardY_left = -Infinity;
    let lastCardY_right = -Infinity;

    return sortedEvents.map((event, index) => {
      const side = index % 2 === 0 ? 'left' : 'right';
      // This is the single source of truth for the event's chronological position.
      const eventY = (event.fractionalYear! - minYear) * yAxisMultiplier * zoom;

      let cardY = eventY;
      
      const lastCardY = side === 'left' ? lastCardY_left : lastCardY_right;

      // Basic overlap avoidance.
      if (cardY < lastCardY + ESTIMATED_CARD_HEIGHT) {
        cardY = lastCardY + ESTIMATED_CARD_HEIGHT;
      }
      
      if (side === 'left') {
        lastCardY_left = cardY;
      } else {
        lastCardY_right = cardY;
      }

      return { ...event, eventY, cardY, side };
    });
  }, [timeline.events, minYear, yAxisMultiplier, zoom]);

  return (
    <div className="relative w-80 shrink-0 h-full">
       <div 
        className="sticky top-0 z-30 py-4 bg-background/80 backdrop-blur-sm -mt-8 pt-8"
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

      <div className="relative h-full">
        {/* The vertical line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-border z-0" />
        
        <div className="relative h-full">
          {positionedEvents.map((event, index) => (
            <TimelineEventCard
              key={`${timeline.id}-${event.date}-${index}`}
              event={event}
              eventY={event.eventY}
              cardY={event.cardY}
              side={event.side}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

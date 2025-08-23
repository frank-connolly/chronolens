'use client';

import type { Timeline } from '@/types';
import TimelineEventCard from './timeline-event-card';

interface TimelineColumnProps {
  timeline: Timeline;
  minYear: number;
  zoom: number;
  yAxisMultiplier: number;
  parseYear: (dateStr: string) => number | null;
}

export default function TimelineColumn({
  timeline,
  minYear,
  zoom,
  yAxisMultiplier,
  parseYear
}: TimelineColumnProps) {

  return (
    <div className="relative w-80 shrink-0 h-full">
      <div className="sticky top-0 z-10 py-4 bg-background/80 backdrop-blur-sm -mt-8 pt-8">
        <h2 className="text-xl font-headline font-bold text-center text-accent-foreground bg-accent p-2 rounded-lg shadow">
          {timeline.title}
        </h2>
      </div>

      {/* Vertical Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-0.5 bg-border -z-10" />
      
      <div className="relative h-full">
        {timeline.events.map((event, index) => {
          const year = parseYear(event.date);
          if (year === null) return null;

          const top = (year - minYear) * yAxisMultiplier * zoom;
          const side = index % 2 === 0 ? 'left' : 'right';

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

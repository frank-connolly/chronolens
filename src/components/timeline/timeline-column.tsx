'use client';

import type { Timeline } from '@/types';
import TimelineEventCard from './timeline-event-card';
import TimeGapIndicator from './time-gap-indicator';

interface TimelineColumnProps {
  timeline: Timeline;
  minYear: number;
  zoom: number;
  yAxisMultiplier: number;
  parseYear: (dateStr: string) => number | null;
}

const CARD_SPACING = 16; // 1rem
const ESTIMATED_CARD_HEIGHT = 80; // Estimated height for an unexpanded card
const GAP_THRESHOLD_YEARS = 50; // Compress gaps larger than this
const COMPRESSED_GAP_HEIGHT = 100; // Height of the visual gap indicator

export default function TimelineColumn({
  timeline,
  minYear,
  zoom,
  yAxisMultiplier,
  parseYear,
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
  let lastEventYear = minYear;
  let accumulatedOffset = 0;

  sortedEvents.forEach((event, index) => {
    const year = event.year as number;
    const side = index % 2 === 0 ? 'left' : 'right';

    // Check for large time gaps
    const yearDiff = year - lastEventYear;
    if (yearDiff > GAP_THRESHOLD_YEARS) {
      const gapTop =
        (lastEventYear - minYear) * yAxisMultiplier * zoom + accumulatedOffset;
      const compressedTop = gapTop + COMPRESSED_GAP_HEIGHT;
      accumulatedOffset +=
        COMPRESSED_GAP_HEIGHT - yearDiff * yAxisMultiplier * zoom;
      
      renderedElements.push(
        <TimeGapIndicator
          key={`gap-${index}`}
          startYear={Math.round(lastEventYear)}
          endYear={Math.round(year)}
          top={gapTop + 30}
        />
      );
    }
    
    const idealTop = (year - minYear) * yAxisMultiplier * zoom + accumulatedOffset;
    
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

    lastEventYear = year;
  });


  return (
    <div className="relative w-80 shrink-0 h-full">
      <div className="sticky top-0 z-10 py-4 bg-background/80 backdrop-blur-sm -mt-8 pt-8">
        <h2 className="text-xl font-headline font-bold text-center text-accent-foreground bg-accent p-2 rounded-lg shadow">
          {timeline.title}
        </h2>
      </div>

      {/* Vertical Line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-0.5 bg-border -z-10" />

      <div className="relative h-full">{renderedElements}</div>
    </div>
  );
}

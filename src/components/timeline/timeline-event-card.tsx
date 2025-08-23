'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { TimelineEvent } from '@/types';
import { cn } from '@/lib/utils';

interface TimelineEventCardProps {
  event: TimelineEvent;
  top: number;
  side: 'left' | 'right';
}

export default function TimelineEventCard({ event, top, side }: TimelineEventCardProps) {
  return (
    <div
      className={cn(
        'absolute w-[calc(50%-1rem)]',
        side === 'left' ? 'left-0' : 'right-0'
      )}
      style={{ top: `${top}px` }}
    >
      <div className="relative">
        <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 border-primary/20">
          <CardHeader className="p-3">
            <CardTitle className="text-base font-bold font-headline text-primary">{event.date}</CardTitle>
            <CardDescription className="text-sm text-foreground/80">{event.event}</CardDescription>
          </CardHeader>
        </Card>
        {/* Connector line and dot */}
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 h-px bg-border w-4',
            side === 'left' ? 'right-[-1rem]' : 'left-[-1rem]'
          )}
        />
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-background border-2 border-accent',
            side === 'left' ? 'right-[-1.75rem]' : 'left-[-1.75rem]'
          )}
        />
      </div>
    </div>
  );
}

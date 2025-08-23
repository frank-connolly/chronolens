'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { TimelineEvent } from '@/types';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface TimelineEventCardProps {
  event: TimelineEvent;
  top: number;
  side: 'left' | 'right';
}

export default function TimelineEventCard({ event, top, side }: TimelineEventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        'absolute w-[calc(50%-1rem)] transition-all duration-300',
        side === 'left' ? 'left-0' : 'right-0',
        isExpanded && 'z-10' // Apply z-index when expanded
      )}
      style={{ top: `${top}px` }}
    >
      <div className="relative">
        <Card 
          className="shadow-md hover:shadow-xl transition-shadow duration-300 border-primary/20 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardHeader className="p-3">
            <div className="flex justify-between items-start">
              <div className='flex-1'>
                <p className="text-xs text-muted-foreground">{event.date}</p>
                <CardTitle className="text-sm font-bold font-headline text-primary leading-tight">
                  {event.title}
                </CardTitle>
              </div>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
            </div>
            {isExpanded && (
              <CardDescription className="text-sm text-foreground/80 pt-2">
                {event.event}
              </CardDescription>
            )}
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

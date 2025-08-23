
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { TimelineEvent } from '@/types';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface TimelineEventCardProps {
  event: TimelineEvent;
  eventY: number; // The actual vertical position of the event on the timeline
  cardY: number;  // The vertical position of the card itself (for layout)
  side: 'left' | 'right';
}

export default function TimelineEventCard({ event, eventY, cardY, side }: TimelineEventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // SVG Path calculation
  // Start the line from the center of the card's attachment side
  const cardStartX = side === 'left' ? '100%' : '0%';
  const cardStartY = cardY; 
  
  // The line bends towards the center timeline
  const controlX = '50%';
  
  // The path ends at the event dot on the timeline
  const eventDotX = '50%';
  const eventDotY = eventY;

  const pathD = `M ${cardStartX} ${cardStartY} C ${controlX} ${cardStartY}, ${controlX} ${eventDotY}, ${eventDotX} ${eventDotY}`;


  return (
    <div
      className={cn(
        'absolute w-full h-full pointer-events-none',
        isExpanded ? 'z-20' : 'z-10' 
      )}
      style={{ top: 0, left: 0 }}
    >
      {/* SVG Container needs to span the full column width and height to draw the path */}
      <svg className="absolute w-full h-full overflow-visible" style={{top: 0, left: 0}}>
          <path d={pathD} stroke="hsl(var(--border))" strokeWidth="1" fill="none" />
      </svg>
      
      {/* Event Dot on the timeline */}
      <div
        className="absolute w-3 h-3 rounded-full bg-background border-2 border-accent"
        style={{
          left: '50%',
          top: 0,
          transform: `translate(-50%, ${eventY - 6}px)`, // Center the dot on the line
        }}
      />
      
      {/* Event Card */}
      <div
        className={cn(
          'absolute w-[calc(50%-1rem)] pointer-events-auto', // 1rem is some spacing margin
          side === 'left' ? 'left-0' : 'right-auto',
          side === 'right' ? 'left-[calc(50%+1rem)]' : 'left-auto'
        )}
        style={{ top: 0, transform: `translateY(${cardY - 37}px)` }} // 37 is half of default card height
      >
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
      </div>
    </div>
  );
}

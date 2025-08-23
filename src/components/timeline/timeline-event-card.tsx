
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

const CARD_WIDTH = 144; // w-36
const CONNECTOR_MARGIN = 16; // 1rem

export default function TimelineEventCard({ event, eventY, cardY, side }: TimelineEventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const cardHorizontalPosition = side === 'left' 
    ? `left-0` 
    : `right-0`;

  // SVG Path calculation
  const startX = 0;
  const startY = eventY;
  const endX = side === 'left' ? -CONNECTOR_MARGIN : CONNECTOR_MARGIN;
  const endY = cardY;
  
  const midY = endY;

  // Path from event dot on timeline to the card
  const pathD = `M ${startX} ${startY} L ${endX} ${midY}`;


  return (
    <div
      className={cn(
        'absolute w-full h-full pointer-events-none',
        isExpanded ? 'z-20' : 'z-10' // Bring card to front when expanded
      )}
      style={{ left: side === 'left' ? 'auto' : '50%', right: side === 'right' ? 'auto' : '50%'}}
    >
      {/* SVG Connector */}
      <svg className="absolute w-1/2 h-full overflow-visible">
          <path d={pathD} stroke="hsl(var(--border))" strokeWidth="1" fill="none" />
      </svg>
      
      {/* Event Dot on the timeline */}
      <div
        className="absolute top-0 w-3 h-3 rounded-full bg-background border-2 border-accent"
        style={{
          transform: `translate(-50%, ${eventY}px) translateY(-50%)`,
          left: '0',
        }}
      />
      
      {/* Event Card */}
      <div
        className={cn(
          'absolute w-[calc(50%-1rem)] pointer-events-auto', // 1rem is the connector margin
          side === 'left' ? 'left-0' : 'right-0'
        )}
        style={{ top: `${cardY}px`, transform: `translateY(-50%)` }}
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

'use client';

import { getMarkerLabel } from './get-marker-label';

interface CursorIndicatorProps {
  top: number;
  year: number;
}

export default function CursorIndicator({ top, year }: CursorIndicatorProps) {
  // Always show the most granular label for the cursor
  const label = getMarkerLabel(year, 'day');

  return (
    <div
      className="pointer-events-none absolute left-0 right-0 z-20"
      style={{
        transform: `translateY(${top}px)`,
      }}
    >
      <div className="relative">
        {/* Line */}
        <div className="absolute w-full h-px bg-accent/50"></div>
        
        {/* Date Label */}
        <div className="absolute left-8 -top-3">
          <span className="bg-accent text-accent-foreground text-xs font-code px-2 py-0.5 rounded">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

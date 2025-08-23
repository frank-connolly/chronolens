'use client';

import { Zap } from 'lucide-react';

interface TimeGapIndicatorProps {
  startYear: number;
  endYear: number;
  top: number;
}

export default function TimeGapIndicator({ startYear, endYear, top }: TimeGapIndicatorProps) {
  const gapDuration = Math.round(endYear - startYear);
  return (
    <div
      className="absolute left-0 right-0 flex items-center justify-center w-full"
      style={{ top: `${top}px` }}
    >
      <div className="flex items-center justify-center text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full border border-dashed">
        <Zap className="h-3 w-3 mr-2" />
        <span>~{gapDuration} year gap</span>
        <Zap className="h-3 w-3 ml-2" />
      </div>
    </div>
  );
}

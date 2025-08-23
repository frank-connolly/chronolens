'use client';

import { useRef, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, ZoomIn, ZoomOut, Loader2, RefreshCw } from 'lucide-react';

interface TimelineControlsProps {
  onAddTimeline: (topic: string) => void;
  isPending: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

export default function TimelineControls({
  onAddTimeline,
  isPending,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  canZoomIn,
  canZoomOut,
}: TimelineControlsProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputRef.current?.value) {
      onAddTimeline(inputRef.current.value);
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Add timeline (e.g., 'Albert Einstein')"
            className="w-64 pl-9"
            disabled={isPending}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Plus />
          )}
          Add
        </Button>
      </form>
      <div className="flex items-center gap-1 rounded-md border p-1">
        <Button variant="ghost" size="icon" onClick={onZoomOut} className="h-8 w-8" disabled={!canZoomOut} title="Zoom Out">
          <ZoomOut />
        </Button>
        <div className="w-px h-6 bg-border mx-1"></div>
        <Button variant="ghost" size="icon" onClick={onZoomIn} className="h-8 w-8" disabled={!canZoomIn} title="Zoom In">
          <ZoomIn />
        </Button>
         <div className="w-px h-6 bg-border mx-1"></div>
        <Button variant="ghost" size="icon" onClick={onZoomReset} className="h-8 w-8" title="Reset Zoom">
          <RefreshCw />
        </Button>
      </div>
    </div>
  );
}

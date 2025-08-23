'use client';

import { useState, useEffect, useTransition, useRef } from 'react';
import type { Timeline } from '@/types';
import { getTimelineForTopic } from '@/app/actions';
import { useToast } from "@/hooks/use-toast"
import TimelineView from '@/components/timeline/timeline-view';
import TimelineControls from '@/components/timeline/timeline-controls';
import { History, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TIMELINES_STORAGE_KEY = 'chronoLensTimelines';

export default function ChronoLensPage() {
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [zoom, setZoom] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { toast } = useToast();
  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Load timelines from localStorage on initial render
  useEffect(() => {
    try {
      const savedTimelines = localStorage.getItem(TIMELINES_STORAGE_KEY);
      if (savedTimelines) {
        setTimelines(JSON.parse(savedTimelines));
        setIsInitialLoading(false);
      } else {
        // If no saved data, fetch the default timeline
        startTransition(async () => {
          const { data, error } = await getTimelineForTopic("History of the Internet");
          if (data) {
            setTimelines([{ ...data, id: 'history-of-the-internet' }]);
          } else if(error) {
             toast({
              title: "Could not load initial timeline",
              description: error,
              variant: "destructive",
            })
          }
          setIsInitialLoading(false);
        });
      }
    } catch (error) {
      console.error("Failed to parse timelines from localStorage", error);
      setIsInitialLoading(false); // Stop loading even if there's an error
    }
  }, [toast]);

  // Save timelines to localStorage whenever they change
  useEffect(() => {
    // We don't save during initial loading to prevent overwriting stored data
    // with a potentially empty or default state before hydration is complete.
    if (!isInitialLoading) {
      localStorage.setItem(TIMELINES_STORAGE_KEY, JSON.stringify(timelines));
    }
  }, [timelines, isInitialLoading]);


  const addTimeline = (topic: string) => {
    if (!topic || timelines.some(t => t.title.toLowerCase() === topic.toLowerCase())) {
      if(timelines.some(t => t.title.toLowerCase() === topic.toLowerCase())) {
        toast({
          title: "Timeline exists",
          description: `A timeline for "${topic}" is already on display.`,
          variant: "destructive",
        })
      }
      return;
    }

    startTransition(async () => {
      const { data, error } = await getTimelineForTopic(topic);
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        })
      } else if (data) {
        setTimelines(prev => [...prev, { ...data, id: topic.toLowerCase() + Date.now() }]);
        // Scroll to the new timeline
        setTimeout(() => {
          mainContainerRef.current?.scrollTo({ left: mainContainerRef.current.scrollWidth, behavior: 'smooth' });
        }, 100);
      }
    });
  };

  const removeTimeline = (id: string) => {
    setTimelines(prev => prev.filter(timeline => timeline.id !== id));
  };

  const handleClear = () => {
    setTimelines([]);
    localStorage.removeItem(TIMELINES_STORAGE_KEY);
  }

  const handleZoomIn = () => setZoom(z => Math.min(z * 1.5, 20));
  const handleZoomOut = () => setZoom(z => Math.max(z / 1.5, 0.1));

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b border-border/50 shadow-sm z-10 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <History className="text-primary h-8 w-8" />
          <h1 className="text-2xl font-headline font-bold text-foreground">ChronoLens</h1>
        </div>
        <div className='flex items-center gap-4'>
           <TimelineControls
            onAddTimeline={addTimeline}
            isPending={isPending}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            zoomLevel={zoom}
            canZoomIn={zoom < 20}
            canZoomOut={zoom > 0.1}
          />
          {timelines.length > 0 && <Button variant="outline" onClick={handleClear}>Clear All</Button>}
        </div>
      </header>
      <main ref={mainContainerRef} className="flex-1 overflow-auto">
        {isInitialLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        ) : (
          <TimelineView timelines={timelines} zoom={zoom} onRemoveTimeline={removeTimeline} />
        )}
      </main>
    </div>
  );
}

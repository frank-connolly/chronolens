'use server';

import { populateTimeline } from '@/ai/flows/populate-timeline';
import type { Timeline } from '@/types';

export async function getTimelineForTopic(topic: string): Promise<{ data?: Omit<Timeline, 'id'>, error?: string }> {
  if (!topic) {
    return { error: 'Topic cannot be empty.' };
  }

  try {
    const result = await populateTimeline({ wikipediaPageTitle: topic });
    if (!result || !result.events || result.events.length === 0) {
      return { error: 'Failed to generate timeline. The topic might not be found or lacks significant events.' };
    }

    const timelineData: Omit<Timeline, 'id'> = {
      title: topic,
      events: result.events,
    };

    return { data: timelineData };
  } catch (e) {
    console.error(e);
    // This could be a more user-friendly message
    return { error: 'An unexpected error occurred while fetching timeline data.' };
  }
}

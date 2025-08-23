// src/ai/flows/populate-timeline.ts
'use server';
/**
 * @fileOverview A flow that populates a timeline with significant dates and events extracted from a Wikipedia page.
 *
 * - populateTimeline - A function that handles the timeline population process.
 * - PopulateTimelineInput - The input type for the populateTimeline function.
 * - PopulateTimelineOutput - The return type for the populateTimeline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PopulateTimelineInputSchema = z.object({
  wikipediaPageTitle: z
    .string()
    .describe('The title of the Wikipedia page to extract timeline data from.'),
});
export type PopulateTimelineInput = z.infer<typeof PopulateTimelineInputSchema>;

const PopulateTimelineOutputSchema = z.object({
  events: z.array(
    z.object({
      date: z.string().describe('The date of the event.'),
      event: z.string().describe('A description of the event.'),
    })
  ).describe('An array of significant events extracted from the Wikipedia page.'),
});
export type PopulateTimelineOutput = z.infer<typeof PopulateTimelineOutputSchema>;

export async function populateTimeline(input: PopulateTimelineInput): Promise<PopulateTimelineOutput> {
  return populateTimelineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'populateTimelinePrompt',
  input: { schema: PopulateTimelineInputSchema },
  output: { schema: PopulateTimelineOutputSchema },
  prompt: `Generate a timeline of significant events for the topic: {{{wikipediaPageTitle}}}. Focus on key dates and concise descriptions.`,
});

const populateTimelineFlow = ai.defineFlow(
  {
    name: 'populateTimelineFlow',
    inputSchema: PopulateTimelineInputSchema,
    outputSchema: PopulateTimelineOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate timeline from AI prompt.');
    }
    return output;
  }
);

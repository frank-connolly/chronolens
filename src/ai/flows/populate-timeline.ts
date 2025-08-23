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

const extractTimelineData = ai.defineTool(
  {
    name: 'extractTimelineData',
    description: 'Extracts significant dates and events from a Wikipedia page.',
    inputSchema: z.object({
      pageTitle: z.string().describe('The title of the Wikipedia page.'),
    }),
    outputSchema: z.array(
      z.object({
        date: z.string().describe('The date of the event.'),
        event: z.string().describe('A description of the event.'),
      })
    ),
  },
  async (input) => {
    // Placeholder implementation for extracting timeline data from Wikipedia.
    // In a real application, this would involve fetching the Wikipedia page,
    // parsing its content, and extracting the relevant dates and events.
    // For now, we return a static list of events as an example.
    console.log(`Extracting timeline for: ${input.pageTitle}`);
    if (input.pageTitle.toLowerCase().includes('internet')) {
       return [
        { date: "1969", event: "ARPANET, the precursor to the internet, is established." },
        { date: "1983", event: "The Domain Name System (DNS) is introduced." },
        { date: "1990", event: "Tim Berners-Lee invents the World Wide Web." },
        { date: "1993", event: "The Mosaic web browser is released." },
        { date: "1998", event: "Google is founded." },
      ];
    }
    return [
      {date: '1903', event: 'Born in Rochester, New York.'},
      {date: '1926', event: 'Earned a B.S. degree from MIT.'},
      {date: '1930', event: 'Received Ph.D. from Caltech.'},
      {date: '1939', event: 'Invented the WFC technology.'},
    ];
  }
);

const populateTimelinePrompt = ai.definePrompt({
  name: 'populateTimelinePrompt',
  tools: [extractTimelineData],
  input: {schema: PopulateTimelineInputSchema},
  output: {schema: PopulateTimelineOutputSchema},
  prompt: `Extract significant dates and events from the Wikipedia page titled "{{{wikipediaPageTitle}}}".\n\nUse the extractTimelineData tool to get the dates and events. Return the results in JSON format.`,}
);

const populateTimelineFlow = ai.defineFlow(
  {
    name: 'populateTimelineFlow',
    inputSchema: PopulateTimelineInputSchema,
    outputSchema: PopulateTimelineOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: `Extract significant dates and events from the Wikipedia page titled "${input.wikipediaPageTitle}".`,
      model: ai.model('googleai/gemini-2.0-flash'),
      tools: [extractTimelineData],
      toolChoice: 'tool',
    });

    const toolRequest = llmResponse.toolRequest();
    if (toolRequest?.name === 'extractTimelineData') {
      const toolOutput = await extractTimelineData(toolRequest.input);
      return { events: toolOutput };
    }
    
    // Fallback or error handling if the tool wasn't called as expected
    const textOutput = llmResponse.text();
    try {
      // Sometimes the model might return JSON directly in the text.
      const parsed = JSON.parse(textOutput);
      if (parsed.events) {
        return parsed;
      }
    } catch (e) {
      // Ignore parsing errors, it wasn't JSON
    }

    return { events: [] };
  }
);

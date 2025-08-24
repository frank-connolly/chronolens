# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

ChronoLens is a NextJS prototype for an app that provides horizontal context across vertical event timelines. It allows users to compare events across multiple historical topics on an interactive, zoomable timeline interface.

## Common Commands

### Development
```bash
# Start development server with Turbopack
npm run dev

# Start the Genkit AI development server
npm run genkit:dev

# Start Genkit in watch mode (auto-reload)
npm run genkit:watch

# Type checking without emitting files
npm run typecheck
```

### Build & Deploy
```bash
# Build production version
npm run build

# Start production server (after build)
npm start

# Run linting
npm run lint
```

### Testing
This project currently doesn't have tests configured. To add testing:
- Consider adding Jest/Vitest for unit tests
- Consider Playwright or Cypress for e2e tests
- Add test scripts to package.json

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI**: Google Genkit with Gemini 2.0 Flash model
- **State Management**: React hooks (useState, useEffect)
- **Data Persistence**: localStorage for timeline storage

### Key Directories

#### `/src/app/` - Next.js App Router
- `page.tsx` - Main ChronoLens application component
- `layout.tsx` - Root layout with fonts and toaster
- `actions.ts` - Server actions for timeline generation
- `globals.css` - Global styles and CSS variables

#### `/src/components/`
- `timeline/` - Timeline visualization components
  - `timeline-view.tsx` - Main timeline container with zoom/cursor handling  
  - `timeline-column.tsx` - Individual timeline column rendering
  - `timeline-controls.tsx` - Search input and zoom controls
  - `year-scale.tsx` - Left-side year markers and scale
  - `cursor-indicator.tsx` - Horizontal cursor line
  - `timeline-event-card.tsx` - Individual event display cards
- `ui/` - shadcn/ui component library (buttons, inputs, dialogs, etc.)

#### `/src/ai/` - AI Integration
- `genkit.ts` - Genkit configuration with Google AI
- `flows/populate-timeline.ts` - AI flow for generating timeline events from topics
- `dev.ts` - Development server for AI flows

#### `/src/lib/` - Utilities
- `date-utils.ts` - Date parsing and fractional year conversion utilities
- `utils.ts` - General utility functions (cn for className merging)

#### `/src/types/` - Type Definitions
- `index.ts` - Core TypeScript interfaces (Timeline, TimelineEvent)

### Data Flow

1. **User Input**: User enters a topic in the timeline controls search input
2. **Server Action**: `getTimelineForTopic` in `actions.ts` is called
3. **AI Processing**: Genkit flow `populateTimeline` generates events using Gemini
4. **Timeline Creation**: New timeline added to state and localStorage
5. **Visualization**: Timeline components render events on a scaled Y-axis by year

### Key Features

#### Timeline Visualization
- Multiple timelines displayed side-by-side in columns
- Y-axis represents time (fractional years) with configurable zoom
- Automatic year range calculation from all events
- Dynamic year markers with appropriate intervals based on zoom
- Mouse cursor shows current year position
- Horizontal grid lines for year alignment

#### Timeline Management
- Add new timelines by topic search
- Remove individual timelines
- Clear all timelines
- Automatic persistence to localStorage
- Duplicate timeline prevention

#### Zoom & Navigation
- Zoom in/out controls (0.25x to 4x)
- Reset zoom to default (1x)
- Scroll-based navigation with zoom center preservation
- Responsive timeline scaling

### AI Integration Details

The app uses Google Genkit with Gemini 2.0 Flash to generate timeline events:

- **Input**: Wikipedia page title or general topic
- **Processing**: AI generates structured timeline data
- **Output Schema**: Array of events with date, title, and description
- **Error Handling**: Graceful fallbacks for AI failures

### Date Handling

The `date-utils.ts` handles various date formats:
- YYYY-MM-DD (ISO format)
- Month YYYY (e.g., "February 1970")  
- YYYY only
- Converts to fractional years for precise timeline positioning

## Development Notes

### Component Patterns
- Uses React Server Components where possible
- Client components marked with 'use client'
- Server actions for AI integration
- Custom hooks for toast notifications

### Styling Approach  
- Tailwind utility classes
- CSS custom properties for theming
- shadcn/ui design system
- Responsive design considerations

### Error Handling
- Toast notifications for user feedback
- Graceful AI failure handling
- localStorage error recovery

### Performance Considerations
- Turbopack for fast development builds
- Memoized calculations for timeline scaling
- Efficient re-rendering with proper dependency arrays

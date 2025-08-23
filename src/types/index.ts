export interface TimelineEvent {
  date: string;
  event: string;
}

export interface Timeline {
  id: string;
  title: string;
  events: TimelineEvent[];
}

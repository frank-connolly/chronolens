export interface TimelineEvent {
  date: string;
  title: string;
  event: string;
}

export interface Timeline {
  id: string;
  title: string;
  events: TimelineEvent[];
}

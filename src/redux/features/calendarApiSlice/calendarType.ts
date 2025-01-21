export type TEvent = {
  name: string;
  start_date: Date;
  end_date: Date;
  day_count: number;
  reason: string;
};

export type TCalendar = {
  year: number;
  holidays: TEvent[];
  events: TEvent[];
  createdAt: Date;
};

export type TCalendarState<T = TCalendar[]> = {
  loading: boolean;
  result: T;
  meta: {
    total: number;
  };
  error: boolean;
};

export type TAllCalendarEvents = {
  result: {
    holidays: TEvent[];
    events: TEvent[];
  };
};

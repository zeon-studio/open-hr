export type TEvent = {
  start_date: Date;
  end_date: Date;
  day_count?: number;
  reason: string;
  type?: string;
};

export type TCalendar = {
  year: number;
  holidays: TEvent[];
  events: TEvent[];
  createdAt?: Date;
};

export type TCalSheet = {
  year: number;
  events: {
    start_date: Date;
    end_date: Date;
    day_count?: number;
    reason: string;
    type: string;
  }[];
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

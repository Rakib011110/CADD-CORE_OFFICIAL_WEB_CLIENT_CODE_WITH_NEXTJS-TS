export type TSeminarRepeat = "none" | "weekly";
export type TSeminarStatus = "upcoming" | "live" | "ended";

export type TSeminar = {
  _id: string;
  topic: string;
  place: string;
  // First session, Bangladesh time: "2026-10-10" and "21:00"
  date: string;
  time: string;
  durationMinutes?: number;
  repeat?: TSeminarRepeat;
  repeatEveryWeeks?: number;
  repeatUntil?: string | null;
  skipDates?: string[];
  registrationUrl?: string;
  isActive?: boolean;
  // Calculated by the API: the running session, or the next one
  nextDate?: string;
  nextTime?: string;
  nextStartsAt?: string;
  nextEndsAt?: string;
  status?: TSeminarStatus;
};

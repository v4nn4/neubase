import { eachDayOfInterval } from "date-fns";

const EASTER_VACATION = eachDayOfInterval({
  start: new Date("2025-04-13"),
  end: new Date("2025-04-24"),
});

const STUTTGART_VACATION = eachDayOfInterval({
  start: new Date("2025-05-01"),
  end: new Date("2025-05-02"),
});

const WEDDING_VACATION = eachDayOfInterval({
  start: new Date("2025-05-27"),
  end: new Date("2025-05-06"),
});

export const ALL_VACATIONS = [
  ...EASTER_VACATION,
  ...STUTTGART_VACATION,
  ...WEDDING_VACATION,
];

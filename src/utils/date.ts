import { DateTime } from "luxon";

export const formatDate = (date: string | Date) => {
  const dt =
    typeof date === "string"
      ? DateTime.fromISO(date)
      : DateTime.fromJSDate(date);

  return dt.toFormat("LLL d, yyyy");
};

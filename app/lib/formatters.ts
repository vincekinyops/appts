export const toIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatReadableDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export const formatFullName = (
  first: string,
  middle: string | null,
  last: string,
) => [first, middle, last].filter(Boolean).join(" ");

export const formatTime = (time: string | null) => {
  if (!time) {
    return "—";
  }
  const [hours, minutes] = time.split(":");
  if (!hours || !minutes) {
    return time;
  }
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
};

import type { AppointmentStatus } from "@/app/lib/types";

export const referralOptions = ["TU0", "TU1", "TU2", "TU3"] as const;
export const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const statusOptions: { value: AppointmentStatus; label: string }[] = [
  { value: "confirmed", label: "Confirmed" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "no_show", label: "No Show / DNA" },
];
export const statusColors: Record<AppointmentStatus, string> = {
  confirmed: "#f97316",
  ongoing: "#22c55e",
  completed: "#3b82f6",
  no_show: "#a855f7",
};

export const statusLabels: Record<AppointmentStatus, string> = {
  confirmed: "Confirmed",
  ongoing: "Ongoing",
  completed: "Completed",
  no_show: "No Show / DNA",
};

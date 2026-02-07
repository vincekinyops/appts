import type { AppointmentStatus } from "@/app/lib/types";

export const referralOptions = ["TU0", "TU1", "TU2", "TU3"] as const;
export const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const statusOptions: { value: AppointmentStatus; label: string }[] = [
  { value: "pending", label: "Pending / Coming" },
  { value: "today", label: "On-the-day" },
  { value: "cancelled", label: "Cancelled" },
  { value: "done", label: "Done" },
];
export const statusColors: Record<AppointmentStatus, string> = {
  pending: "#f97316",
  today: "#22c55e",
  cancelled: "#ef4444",
  done: "#3b82f6",
};

"use client";

import { useMemo } from "react";
import type { CalendarEvent } from "@/app/lib/types";
import { statusColors, statusLabels } from "@/app/lib/constants";
import { formatFullName, formatReadableDate, formatTime } from "@/app/lib/formatters";

type AppointmentsListModalProps = {
  isOpen: boolean;
  date: string | null;
  appointments: CalendarEvent[];
  anchorRect: DOMRect | null;
  onClose: () => void;
};

export function AppointmentsListModal({
  isOpen,
  date,
  appointments,
  anchorRect,
  onClose,
}: AppointmentsListModalProps) {
  const sortedAppointments = useMemo(
    () =>
      [...appointments].sort((a, b) => {
        const timeA = a.time ?? "99:99";
        const timeB = b.time ?? "99:99";
        return timeA.localeCompare(timeB);
      }),
    [appointments],
  );

  if (!isOpen || !date || !anchorRect) {
    return null;
  }

  const maxWidth = 320;
  const maxHeight = 360;
  const padding = 12;
  const topDefault = anchorRect.bottom + 8;
  const top =
    topDefault + maxHeight > window.innerHeight
      ? Math.max(padding, anchorRect.top - 8 - maxHeight)
      : topDefault;
  const left = Math.min(
    Math.max(padding, anchorRect.left),
    window.innerWidth - maxWidth - padding,
  );

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close appointments list"
      />
      <div
        className="absolute w-[320px] rounded-md border border-zinc-200 bg-white p-4 text-[color:var(--foreground)] shadow-xl"
        style={{ top, left }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{formatReadableDate(date)}</h3>
            <p className="text-sm text-[color:var(--foreground)]/70">
              {appointments.length} total
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[color:var(--foreground)]/70 hover:bg-[color:var(--background)]"
            aria-label="Close"
          >
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-4 max-h-[320px] space-y-2 overflow-auto pr-1">
          {sortedAppointments.map((event) => (
            <div
              key={event.id}
              className="flex items-start justify-between gap-4 rounded-md border border-zinc-200 bg-[color:var(--background)] px-3 py-2"
            >
              <div className="min-w-0">
                <div className="text-xs font-semibold">{event.title}</div>
                <div className="mt-1 text-[11px] text-[color:var(--foreground)]/70">
                  {formatFullName(
                    event.patient_first_name,
                    event.patient_middle_name,
                    event.patient_last_name,
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-[color:var(--foreground)]/70">
                  {formatTime(event.time)}
                </div>
                <div
                  className="mt-1 text-[11px] font-semibold capitalize"
                  style={{ color: statusColors[event.status] }}
                >
                  {statusLabels[event.status]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

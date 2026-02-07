import type { CalendarEvent } from "@/app/lib/types";
import { weekdayLabels } from "@/app/lib/constants";

type CalendarSectionProps = {
  monthLabel: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  calendarCells: Array<Date | null>;
  eventsByDate: Map<string, CalendarEvent[]>;
  onOpenDate: (dateValue: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onViewDayAppointments: (
    dateValue: string,
    events: CalendarEvent[],
    anchorRect: DOMRect,
  ) => void;
  selectedDate: string | null;
  todayIso: string;
  toIsoDate: (date: Date) => string;
};

export function CalendarSection({
  monthLabel,
  onPrevMonth,
  onNextMonth,
  calendarCells,
  eventsByDate,
  onOpenDate,
  onEditEvent,
  onViewDayAppointments,
  selectedDate,
  todayIso,
  toIsoDate,
}: CalendarSectionProps) {
  return (
    <section className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{monthLabel}</h2>
          <p className="text-sm text-[color:var(--foreground)]/70">
            Click a date to add an appointment and set its status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-md border border-zinc-200 px-3 py-1 text-sm text-[color:var(--foreground)]/70 hover:bg-white"
            onClick={onPrevMonth}
          >
            Previous
          </button>
          <span className="text-sm font-medium text-[color:var(--foreground)]">
            {monthLabel}
          </span>
          <button
            type="button"
            className="rounded-md border border-zinc-200 px-3 py-1 text-sm text-[color:var(--foreground)]/70 hover:bg-white"
            onClick={onNextMonth}
          >
            Following
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-2 text-xs font-semibold text-[color:var(--foreground)]/65">
        {weekdayLabels.map((label) => (
          <div key={label} className="text-center">
            {label}
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-7 gap-px rounded-md border border-zinc-200 bg-zinc-200">
        {calendarCells
          .reduce<Array<Array<Date | null>>>((weeks, cell, index) => {
            if (index % 7 === 0) {
              weeks.push([]);
            }
            weeks[weeks.length - 1].push(cell);
            return weeks;
          }, [])
          .filter((week) => week.some(Boolean))
          .flat()
          .map((dateValue, index) => {
            if (!dateValue) {
              return (
              <div
                key={`empty-${index}`}
                className="h-24 bg-white"
              />
              );
            }
            const isoDate = toIsoDate(dateValue);
            const dayEvents = eventsByDate.get(isoDate) ?? [];
          const isPastDay = isoDate < todayIso;
            const isSelected = selectedDate === isoDate;
            return (
              <div
                key={isoDate}
                role="button"
                tabIndex={0}
              onClick={(event) => {
                if (isPastDay) {
                  if (dayEvents.length > 0) {
                    const rect = (
                      event.currentTarget as HTMLElement
                    ).getBoundingClientRect();
                    onViewDayAppointments(isoDate, dayEvents, rect);
                  }
                  return;
                }
                onOpenDate(isoDate);
              }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                  if (isPastDay) {
                    if (dayEvents.length > 0) {
                      const rect = (
                        event.currentTarget as HTMLElement
                      ).getBoundingClientRect();
                      onViewDayAppointments(isoDate, dayEvents, rect);
                    }
                    return;
                  }
                  onOpenDate(isoDate);
                  }
                }}
              className={`flex h-24 flex-col p-2 text-left transition hover:bg-[color:var(--background)] ${
                isSelected ? "bg-[#fff1e6]" : "bg-white"
              } ${
                isPastDay
                  ? "bg-zinc-100 text-[color:var(--foreground)]/40"
                  : "text-[color:var(--foreground)]"
              }`}
              >
              <div className="flex items-center justify-between text-xs font-semibold text-[color:var(--foreground)]">
                <span>{dateValue.getDate()}</span>
                {dayEvents.length > 0 && (
                  <button
                    type="button"
                    onClick={(clickEvent) => {
                      clickEvent.stopPropagation();
                      const rect = (
                        clickEvent.currentTarget as HTMLElement
                      ).getBoundingClientRect();
                      onViewDayAppointments(isoDate, dayEvents, rect);
                    }}
                    className="rounded-md p-1 text-[color:var(--foreground)]/70 hover:bg-[color:var(--background)]"
                    aria-label="View appointments"
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
                      <path d="M1.5 12s4-7 10.5-7 10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
                      <circle cx="12" cy="12" r="3.5" />
                    </svg>
                  </button>
                )}
              </div>
                <div className="mt-1 flex flex-1 flex-col gap-1 overflow-hidden">
                  {dayEvents.slice(0, 2).map((event) => (
                    <button
                      type="button"
                      key={event.id}
                      onClick={(clickEvent) => {
                        clickEvent.stopPropagation();
                        if (isPastDay) {
                          const rect = (
                            clickEvent.currentTarget as HTMLElement
                          ).getBoundingClientRect();
                          onViewDayAppointments(isoDate, dayEvents, rect);
                          return;
                        }
                        onEditEvent(event);
                      }}
                    className="flex items-center gap-2 bg-[color:var(--background)] px-2 py-0.5 text-[10px] text-[color:var(--foreground)]"
                    >
                      <span
                      className="h-2 w-2 rounded-md"
                        style={{ backgroundColor: event.color }}
                      />
                      <span className="truncate">{event.title}</span>
                    </button>
                  ))}
                  {dayEvents.length > 2 && (
                  <span className="text-[9px] leading-tight text-[color:var(--foreground)]/50">
                      +{dayEvents.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}

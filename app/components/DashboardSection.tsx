"use client";

import { useMemo, useState } from "react";
import type { CalendarEvent, CommunicationEntry } from "@/app/lib/types";
import {
  referralOptions,
  statusColors,
  statusLabels,
  statusOptions,
} from "@/app/lib/constants";
import { formatReadableDate } from "@/app/lib/formatters";

type DashboardSectionProps = {
  communications: CommunicationEntry[];
  events: CalendarEvent[];
  upcomingEvents: CalendarEvent[];
};

export function DashboardSection({
  communications,
  events,
  upcomingEvents,
}: DashboardSectionProps) {
  const referralCounts = referralOptions.map((option) => ({
    type: option,
    count: communications.filter((entry) => entry.referral_type === option)
      .length,
  }));
  const totalReferrals = referralCounts.reduce((sum, item) => sum + item.count, 0);
  const referralColors = [
    "var(--primary)",
    "var(--secondary)",
    "var(--accent)",
    "#94a3b8",
    "#f97316",
  ];

  const monthOptions = useMemo(() => {
    const keys = new Set<string>();
    events.forEach((event) => {
      keys.add(event.date.slice(0, 7));
    });
    return Array.from(keys)
      .sort()
      .map((key) => {
        const [year, month] = key.split("-");
        const date = new Date(Number(year), Number(month) - 1, 1);
        return {
          value: key,
          label: date.toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          }),
        };
      });
  }, [events]);

  const dentistOptions = useMemo(() => {
    const names = new Set<string>();
    communications.forEach((entry) => {
      if (entry.current_dentist) {
        names.add(entry.current_dentist);
      }
    });
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [communications]);

  const schoolYearOptions = useMemo(() => {
    const years = new Set<string>();
    communications.forEach((entry) => {
      if (entry.school_year) {
        years.add(entry.school_year);
      }
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [communications]);

  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedDentist, setSelectedDentist] = useState<string>("all");
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const linkedCommunicationByAppointment = useMemo(() => {
    const map = new Map<string, CommunicationEntry>();
    communications.forEach((entry) => {
      if (entry.appointment_id) {
        map.set(entry.appointment_id, entry);
      }
    });
    return map;
  }, [communications]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (selectedMonth !== "all" && event.date.slice(0, 7) !== selectedMonth) {
        return false;
      }
      if (selectedStatus !== "all" && event.status !== selectedStatus) {
        return false;
      }
      if (selectedDentist !== "all" || selectedSchoolYear !== "all") {
        const linked = linkedCommunicationByAppointment.get(event.id);
        if (!linked) {
          return false;
        }
        if (
          selectedDentist !== "all" &&
          linked.current_dentist !== selectedDentist
        ) {
          return false;
        }
        if (
          selectedSchoolYear !== "all" &&
          linked.school_year !== selectedSchoolYear
        ) {
          return false;
        }
      }
      return true;
    });
  }, [
    events,
    linkedCommunicationByAppointment,
    selectedMonth,
    selectedStatus,
    selectedDentist,
    selectedSchoolYear,
  ]);

  const statusCounts = statusOptions.map((option) => ({
    status: option.value,
    label: option.label,
    count: filteredEvents.filter((event) => event.status === option.value)
      .length,
  }));

  const maxStatusCount = Math.max(
    1,
    ...statusCounts.map((item) => item.count),
  );

  return (
    <section className="grid gap-6 lg:grid-cols-[3fr_1fr]">
      <div className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Appointments</h2>
              <p className="text-sm text-[color:var(--foreground)]/70">
                Visual breakdown of scheduled events by status.
              </p>
            </div>
            <div className="grid w-full gap-3 text-xs font-medium text-[color:var(--foreground)]/70 sm:grid-cols-2 lg:max-w-xl lg:grid-cols-2">
              <label className="grid gap-1">
                Month
                <select
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(event.target.value)}
                  className="rounded-md border border-zinc-200 px-3 py-2 text-sm"
                >
                  <option value="all">All months</option>
                  {monthOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1">
                Dentist
                <select
                  value={selectedDentist}
                  onChange={(event) => setSelectedDentist(event.target.value)}
                  className="rounded-md border border-zinc-200 px-3 py-2 text-sm"
                >
                  <option value="all">All dentists</option>
                  {dentistOptions.map((dentist) => (
                    <option key={dentist} value={dentist}>
                      {dentist}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1">
                School Year
                <select
                  value={selectedSchoolYear}
                  onChange={(event) => setSelectedSchoolYear(event.target.value)}
                  className="rounded-md border border-zinc-200 px-3 py-2 text-sm"
                >
                  <option value="all">All years</option>
                  {schoolYearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1">
                Status
                <select
                  value={selectedStatus}
                  onChange={(event) => setSelectedStatus(event.target.value)}
                  className="rounded-md border border-zinc-200 px-3 py-2 text-sm"
                >
                  <option value="all">All statuses</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {statusCounts.map((item) => (
            <div key={item.status} className="space-y-1">
              <div className="flex items-start justify-between gap-3 text-xs text-[color:var(--foreground)]/70">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: statusColors[item.status] }}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                <span className="shrink-0">{item.count}</span>
              </div>
              <div className="h-2 rounded-full bg-[color:var(--background)] overflow-hidden">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(item.count / maxStatusCount) * 100}%`,
                    backgroundColor: statusColors[item.status],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Referral Distribution</h2>
        <p className="text-xs text-[color:var(--foreground)]/70">
          Referral mix based on activity entries.
        </p>
        <div className="mt-4 flex items-center justify-center">
          {totalReferrals === 0 ? (
            <p className="text-sm text-[color:var(--foreground)]/65">
              No referral data yet.
            </p>
          ) : (
            <svg
              viewBox="0 0 120 120"
              className="h-36 w-36"
              role="img"
              aria-label="Referral distribution"
            >
              <circle
                cx="60"
                cy="60"
                r="42"
                fill="none"
                stroke="var(--background)"
                strokeWidth="16"
              />
              {referralCounts.map((item, index) => {
                const circumference = Math.PI * 2 * 42;
                const dash = totalReferrals
                  ? (item.count / totalReferrals) * circumference
                  : 0;
                const dashArray = `${dash} ${circumference - dash}`;
                const offset = referralCounts
                  .slice(0, index)
                  .reduce(
                    (sum, current) =>
                      sum +
                      (totalReferrals
                        ? (current.count / totalReferrals) * circumference
                        : 0),
                    0,
                  );
                return (
                  <circle
                    key={item.type}
                    cx="60"
                    cy="60"
                    r="42"
                    fill="none"
                    stroke={referralColors[index % referralColors.length]}
                    strokeWidth="16"
                    strokeDasharray={dashArray}
                    strokeDashoffset={-offset}
                    strokeLinecap="butt"
                  />
                );
              })}
            </svg>
          )}
        </div>
        <div className="mt-4 space-y-2 text-xs text-[color:var(--foreground)]/70">
          {referralCounts.map((item, index) => (
            <div key={item.type} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      referralColors[index % referralColors.length],
                  }}
                />
                <span>{item.type}</span>
              </div>
              <span>{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
          <span className="text-xs text-[color:var(--foreground)]/60">
            Upcoming 7 days
          </span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.length === 0 && (
            <p className="text-sm text-[color:var(--foreground)]/65">
              No upcoming appointments scheduled.
            </p>
          )}
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-md border border-zinc-200 bg-[color:var(--background)] p-4"
            >
              <div className="flex items-center justify-between text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: event.color }}
                  />
                  {event.title}
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                  style={{ backgroundColor: statusColors[event.status] }}
                >
                  {statusLabels[event.status]}
                </span>
              </div>
              <p className="mt-2 text-xs text-[color:var(--foreground)]/65">
                {formatReadableDate(event.date)}
                {event.time ? ` • ${event.time}` : ""}
              </p>
              {event.notes && (
                <p className="mt-2 text-xs text-[color:var(--foreground)]/80">
                  {event.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

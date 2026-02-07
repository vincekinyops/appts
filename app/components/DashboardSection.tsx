import type { CalendarEvent, CommunicationEntry } from "@/app/lib/types";
import { referralOptions, statusColors } from "@/app/lib/constants";
import { formatReadableDate } from "@/app/lib/formatters";

type DashboardSectionProps = {
  communications: CommunicationEntry[];
  statusCounts: { status: CalendarEvent["status"]; label: string; count: number }[];
  maxStatusCount: number;
  upcomingEvents: CalendarEvent[];
};

export function DashboardSection({
  communications,
  statusCounts,
  maxStatusCount,
  upcomingEvents,
}: DashboardSectionProps) {
  const referralCounts = referralOptions.map((option) => ({
    type: option,
    count: communications.filter((entry) => entry.referral_type === option)
      .length,
  }));
  const maxReferralCount = Math.max(
    1,
    ...referralCounts.map((item) => item.count),
  );

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Referral Distribution</h2>
        <p className="text-sm text-[color:var(--foreground)]/70">
          Referral mix based on activity entries.
        </p>
        <div className="mt-6 space-y-4">
          {referralCounts.map((item) => (
            <div key={item.type} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-[color:var(--foreground)]/70">
                <span>{item.type}</span>
                <span>{item.count}</span>
              </div>
              <div className="h-2 rounded-full bg-[color:var(--background)]">
                <div
                  className="h-2 rounded-full bg-[color:var(--primary)]"
                  style={{
                    width: `${(item.count / maxReferralCount) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Appointments by Status</h2>
        <p className="text-sm text-[color:var(--foreground)]/70">
          Visual breakdown of scheduled events by status.
        </p>
        <div className="mt-6 space-y-4">
          {statusCounts.map((item) => (
            <div key={item.status} className="space-y-1">
              <div className="flex items-center justify-between text-xs text-[color:var(--foreground)]/70">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: statusColors[item.status] }}
                  />
                  <span>{item.label}</span>
                </div>
                <span>{item.count}</span>
              </div>
              <div className="h-2 rounded-full bg-[color:var(--background)]">
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
                  {event.status}
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

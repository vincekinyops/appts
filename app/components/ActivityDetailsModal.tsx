import type { CommunicationEntry } from "@/app/lib/types";
import { formatFullName, formatReadableDate } from "@/app/lib/formatters";

type ActivityDetailsModalProps = {
  entry: CommunicationEntry | null;
  onClose: () => void;
  onEdit: (entry: CommunicationEntry) => void;
};

export function ActivityDetailsModal({
  entry,
  onClose,
  onEdit,
}: ActivityDetailsModalProps) {
  if (!entry) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--foreground)]/20 px-4">
      <div className="w-full max-w-xl rounded-md bg-white p-6 text-[color:var(--foreground)] shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">Activity Details</h3>
            <p className="text-sm text-[color:var(--foreground)]/70">
              {formatReadableDate(entry.date)}
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

        <div className="mt-4 grid gap-3 text-sm">
          <div>
            <span className="text-xs text-[color:var(--foreground)]/60">
              Patient
            </span>
            <div className="font-semibold">
              {formatFullName(
                entry.patient_first_name,
                entry.patient_middle_name,
                entry.patient_last_name,
              )}
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <span className="text-xs text-[color:var(--foreground)]/60">
                Current Dentist
              </span>
              <div>{entry.current_dentist || "—"}</div>
            </div>
            <div>
              <span className="text-xs text-[color:var(--foreground)]/60">
                Created By
              </span>
              <div>{entry.created_by}</div>
            </div>
            <div>
              <span className="text-xs text-[color:var(--foreground)]/60">
                Date Called
              </span>
              <div>{entry.date_called || "—"}</div>
            </div>
            <div>
              <span className="text-xs text-[color:var(--foreground)]/60">
                Date Emailed
              </span>
              <div>{entry.date_emailed || "—"}</div>
            </div>
            <div>
              <span className="text-xs text-[color:var(--foreground)]/60">
                Referral Type
              </span>
              <div>{entry.referral_type}</div>
            </div>
            <div>
              <span className="text-xs text-[color:var(--foreground)]/60">
                School Year
              </span>
              <div>{entry.school_year}</div>
            </div>
          </div>
          <div>
            <span className="text-xs text-[color:var(--foreground)]/60">
              Notes
            </span>
            <div>{entry.notes || "—"}</div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => onEdit(entry)}
            className="rounded-md bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Edit Activity
          </button>
        </div>
      </div>
    </div>
  );
}

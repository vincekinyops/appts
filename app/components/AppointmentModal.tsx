import type {
  AppointmentForm,
  AppointmentStatus,
  PreviousPatient,
} from "@/app/lib/types";
import { statusOptions } from "@/app/lib/constants";
import { formatFullName, formatReadableDate } from "@/app/lib/formatters";

type AppointmentModalProps = {
  isOpen: boolean;
  selectedEventId: string | null;
  form: AppointmentForm;
  onFormChange: (updater: (prev: AppointmentForm) => AppointmentForm) => void;
  onClose: () => void;
  onSave: () => void;
  previousPatients: PreviousPatient[];
};

export function AppointmentModal({
  isOpen,
  selectedEventId,
  form,
  onFormChange,
  onClose,
  onSave,
  previousPatients,
}: AppointmentModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--foreground)]/20 px-4">
      <div className="w-full max-w-lg rounded-md bg-white p-6 text-[color:var(--foreground)] shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {selectedEventId ? "Edit Appointment" : "New Appointment"}
            </h3>
            <p className="text-sm text-zinc-500">
              {formatReadableDate(form.date)}
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

        <div className="mt-4 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            <span>
              Title <span className="text-red-600">*</span>
            </span>
            <input
              type="text"
              value={form.title}
              onChange={(event) =>
                onFormChange((prev) => ({
                  ...prev,
                  title: event.target.value,
                }))
              }
              required
            className="rounded-md border border-zinc-200 px-3 py-2 text-sm"
              placeholder="Appointment name"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-zinc-700 sm:col-span-2">
              Previous Patient
              <select
                value=""
                onChange={(event) => {
                  const [first, middle, last] = event.target.value.split("|");
                  if (!first || !last) {
                    return;
                  }
                  onFormChange((prev) => ({
                    ...prev,
                    patientFirstName: first,
                    patientMiddleName: middle || "",
                    patientLastName: last,
                  }));
                }}
                className="rounded-md border border-zinc-200 px-3 py-2 pr-10 text-sm"
              >
                <option value="">Select a previous patient</option>
                {previousPatients.map((patient) => (
                  <option
                    key={`${patient.first}-${patient.middle}-${patient.last}`}
                    value={`${patient.first}|${patient.middle}|${patient.last}`}
                  >
                    {formatFullName(
                      patient.first,
                      patient.middle,
                      patient.last,
                    )}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Date
              <input
                type="date"
                value={form.date}
                onChange={(event) =>
                  onFormChange((prev) => ({
                    ...prev,
                    date: event.target.value,
                  }))
                }
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Time
              <input
                type="time"
                value={form.time}
                onChange={(event) =>
                  onFormChange((prev) => ({
                    ...prev,
                    time: event.target.value,
                  }))
                }
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm"
              />
            </label>
            <div className="grid gap-4 sm:col-span-2 sm:grid-cols-3">
              <label className="grid min-w-0 gap-2 text-sm font-medium text-zinc-700">
                <span>
                  First Name <span className="text-red-600">*</span>
                </span>
                <input
                  type="text"
                  value={form.patientFirstName}
                  onChange={(event) =>
                    onFormChange((prev) => ({
                      ...prev,
                      patientFirstName: event.target.value,
                    }))
                  }
                  required
                  className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="grid min-w-0 gap-2 text-sm font-medium text-zinc-700">
                Middle Name
                <input
                  type="text"
                  value={form.patientMiddleName}
                  onChange={(event) =>
                    onFormChange((prev) => ({
                      ...prev,
                      patientMiddleName: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="grid min-w-0 gap-2 text-sm font-medium text-zinc-700">
                <span>
                  Last Name <span className="text-red-600">*</span>
                </span>
                <input
                  type="text"
                  value={form.patientLastName}
                  onChange={(event) =>
                    onFormChange((prev) => ({
                      ...prev,
                      patientLastName: event.target.value,
                    }))
                  }
                  required
                  className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Status
              <select
                value={form.status}
                onChange={(event) =>
                  onFormChange((prev) => ({
                    ...prev,
                    status: event.target.value as AppointmentStatus,
                  }))
                }
                className="rounded-md border border-zinc-200 px-3 py-2 pr-10 text-sm"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            Notes
            <textarea
              value={form.notes}
              onChange={(event) =>
                onFormChange((prev) => ({
                  ...prev,
                  notes: event.target.value,
                }))
              }
              rows={3}
            className="rounded-md border border-zinc-200 px-3 py-2 text-sm"
            />
          </label>
          <button
            type="button"
            onClick={onSave}
            className="rounded-md bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Save Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

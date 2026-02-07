import type { FormEvent } from "react";
import type {
  ActivityForm,
  AppointmentOption,
  CalendarEvent,
  CommunicationEntry,
  PreviousPatient,
} from "@/app/lib/types";
import { referralOptions } from "@/app/lib/constants";
import { formatFullName, formatReadableDate } from "@/app/lib/formatters";

type ActivitiesSectionProps = {
  form: ActivityForm;
  onFormChange: (updater: (prev: ActivityForm) => ActivityForm) => void;
  previousPatients: PreviousPatient[];
  appointmentOptions: AppointmentOption[];
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  communications: CommunicationEntry[];
  events: CalendarEvent[];
  isLoading: boolean;
};

export function ActivitiesSection({
  form,
  onFormChange,
  previousPatients,
  appointmentOptions,
  onSubmit,
  communications,
  events,
  isLoading,
}: ActivitiesSectionProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Activities</h2>
        <p className="text-sm text-[color:var(--foreground)]/70">
          Capture patient outreach details for every interaction.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
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
            <label className="grid gap-2 text-sm font-medium text-zinc-700 sm:col-span-2">
              Link Appointment (optional)
              <select
                value={form.appointmentId}
                onChange={(event) => {
                  const appointmentId = event.target.value;
                  const selected = appointmentOptions.find(
                    (option) => option.id === appointmentId,
                  );
                  if (selected) {
                    onFormChange((prev) => ({
                      ...prev,
                      appointmentId,
                      date: selected.event.date,
                      patientFirstName: selected.event.patient_first_name,
                      patientMiddleName:
                        selected.event.patient_middle_name ?? "",
                      patientLastName: selected.event.patient_last_name,
                    }));
                  } else {
                    onFormChange((prev) => ({
                      ...prev,
                      appointmentId: "",
                    }));
                  }
                }}
                className="rounded-md border border-zinc-200 px-3 py-2 pr-10 text-sm"
              >
                <option value="">No linked appointment</option>
                {appointmentOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
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
                required
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm"
              />
            </label>
            <div className="grid gap-4 sm:col-span-2 sm:grid-cols-3">
              <label className="grid gap-2 text-sm font-medium text-zinc-700">
                First Name
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
              <label className="grid gap-2 text-sm font-medium text-zinc-700">
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
              <label className="grid gap-2 text-sm font-medium text-zinc-700">
                Last Name
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
              School Year
              <input
                type="text"
                value={form.schoolYear}
                onChange={(event) =>
                  onFormChange((prev) => ({
                    ...prev,
                    schoolYear: event.target.value,
                  }))
                }
                required
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Current Dentist
              <input
                type="text"
                value={form.currentDentist}
                onChange={(event) =>
                  onFormChange((prev) => ({
                    ...prev,
                    currentDentist: event.target.value,
                  }))
                }
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Language
              <input
                type="text"
                value={form.language}
                onChange={(event) =>
                  onFormChange((prev) => ({
                    ...prev,
                    language: event.target.value,
                  }))
                }
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Date Called
              <input
                type="date"
                value={form.dateCalled}
                onChange={(event) =>
                  onFormChange((prev) => ({
                    ...prev,
                    dateCalled: event.target.value,
                  }))
                }
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Date Emailed
              <input
                type="date"
                value={form.dateEmailed}
                onChange={(event) =>
                  onFormChange((prev) => ({
                    ...prev,
                    dateEmailed: event.target.value,
                  }))
                }
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Referral Type
              <select
                value={form.referralType}
                onChange={(event) =>
                  onFormChange((prev) => ({
                    ...prev,
                    referralType: event.target.value,
                  }))
                }
                className="rounded-md border border-zinc-200 px-3 py-2 pr-10 text-sm"
              >
                {referralOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
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
              rows={4}
            className="rounded-md border border-zinc-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            Created By
            <input
              type="text"
              value={form.createdBy}
              onChange={(event) =>
                onFormChange((prev) => ({
                  ...prev,
                  createdBy: event.target.value,
                }))
              }
              required
            className="rounded-md border border-zinc-200 px-3 py-2 text-sm"
            />
          </label>
          <button
            type="submit"
            className="mt-2 rounded-md bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Save Activity
          </button>
        </form>
      </div>

      <div className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Activities</h3>
          {isLoading && <span className="text-xs text-zinc-400">Loading...</span>}
        </div>
        <div className="mt-4 space-y-3">
          {communications.length === 0 && !isLoading && (
            <p className="text-sm text-[color:var(--foreground)]/65">
              No activity entries yet.
            </p>
          )}
          {communications.slice(0, 6).map((entry) => {
            const linkedEvent = events.find(
              (event) => event.id === entry.appointment_id,
            );
            return (
              <div
                key={entry.id}
                className="rounded-md border border-zinc-200 bg-white/70 p-4 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[color:var(--foreground)]">
                    {formatFullName(
                      entry.patient_first_name,
                      entry.patient_middle_name,
                      entry.patient_last_name,
                    )}
                  </span>
                  <span className="text-xs text-[color:var(--foreground)]/55">
                    {formatReadableDate(entry.date)}
                  </span>
                </div>
                <div className="mt-2 text-xs text-[color:var(--foreground)]/65">
                  {entry.referral_type} • {entry.school_year} •{" "}
                  {entry.language || "Language N/A"}
                </div>
                {linkedEvent && (
                  <div className="mt-2 text-xs text-[color:var(--foreground)]/65">
                    Appointment status: {linkedEvent.status}
                  </div>
                )}
                {entry.notes && (
                  <p className="mt-2 text-xs text-[color:var(--foreground)]/80">
                    {entry.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

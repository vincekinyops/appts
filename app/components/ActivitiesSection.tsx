import type { FormEvent } from "react";
import type {
  ActivityForm,
  AppointmentOption,
  CalendarEvent,
  CommunicationEntry,
  Dentist,
  PreviousPatient,
  StaffMember,
} from "@/app/lib/types";
import { referralOptions, statusLabels } from "@/app/lib/constants";
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
  dentists: Dentist[];
  staff: StaffMember[];
  isEditing: boolean;
  onOpenDetails: (entry: CommunicationEntry) => void;
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
  dentists,
  staff,
  isEditing,
  onOpenDetails,
}: ActivitiesSectionProps) {
  const createdByOptions = [
    ...staff.map((member) => ({ id: member.id, name: member.name })),
    ...dentists.map((dentist) => ({ id: dentist.id, name: dentist.name })),
  ];

  return (
    <section className="grid gap-6 lg:grid-cols-[3fr_1fr]">
      <div className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Activities</h2>
        <p className="text-sm text-[color:var(--foreground)]/70">
          Capture patient outreach details for every interaction.
        </p>

        <form className="activities-form mt-6 grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-4 lg:grid-cols-2 lg:auto-rows-min">
            <label className="grid content-start gap-1 text-sm font-medium text-zinc-700 lg:col-start-1 lg:row-start-1">
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
            <label className="grid content-start gap-1 text-sm font-medium text-zinc-700 lg:col-start-2 lg:row-start-1">
              Current Dentist
              <select
                value={form.currentDentist}
                onChange={(event) =>
                  onFormChange((prev) => ({
                    ...prev,
                    currentDentist: event.target.value,
                  }))
                }
                className="rounded-md border border-zinc-200 px-3 py-2 pr-10 text-sm"
              >
                <option value="">Select dentist</option>
                {dentists.map((dentist) => (
                  <option key={dentist.id} value={dentist.name}>
                    {dentist.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid content-start gap-1 text-sm font-medium text-zinc-700 lg:col-start-1 lg:row-start-2">
              <span>
                Date <span className="text-red-600">*</span>
              </span>
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
            <label className="grid content-start gap-1 text-sm font-medium text-zinc-700 lg:col-start-2 lg:row-start-2">
              <span>
                Created By <span className="text-red-600">*</span>
              </span>
              <select
                value={form.createdBy}
                onChange={(event) =>
                  onFormChange((prev) => ({
                    ...prev,
                    createdBy: event.target.value,
                  }))
                }
                required
                className="rounded-md border border-zinc-200 px-3 py-2 pr-10 text-sm"
              >
                <option value="">Select staff or dentist</option>
                {createdByOptions.map((member) => (
                  <option key={member.id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-3 lg:col-start-1 lg:row-start-3">
              <label className="grid content-start gap-1 text-sm font-medium text-zinc-700">
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
              <label className="grid content-start gap-1 text-sm font-medium text-zinc-700">
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
              <label className="grid content-start gap-1 text-sm font-medium text-zinc-700">
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
            <label className="grid content-start gap-1 text-sm font-medium text-zinc-700 lg:col-start-2 lg:row-start-3">
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
                max={new Date().toISOString().split("T")[0]}
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm"
              />
            </label>

            <label className="grid content-start gap-1 text-sm font-medium text-zinc-700 lg:col-start-1 lg:row-start-4">
              <span>
                School Year <span className="text-red-600">*</span>
              </span>
              <select
                value={form.schoolYear}
                onChange={(event) =>
                  onFormChange((prev) => ({
                    ...prev,
                    schoolYear: event.target.value,
                  }))
                }
                required
                className="rounded-md border border-zinc-200 px-3 py-2 pr-10 text-sm"
              >
                <option value="">Select year</option>
                {Array.from(
                  { length: new Date().getFullYear() - 1999 },
                  (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={`${year}`}>
                        {year}
                      </option>
                    );
                  },
                )}
              </select>
            </label>
            <label className="grid content-start gap-1 text-sm font-medium text-zinc-700 lg:col-start-2 lg:row-start-4">
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
                max={new Date().toISOString().split("T")[0]}
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm"
              />
            </label>

            <label className="grid content-start gap-1 text-sm font-medium text-zinc-700 lg:col-start-1 lg:row-start-5">
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

            <label className="grid content-start gap-1 text-sm font-medium text-zinc-700 lg:col-start-1 lg:row-start-6">
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

            <label className="grid content-start gap-1 text-sm font-medium text-zinc-700 lg:col-start-2 lg:row-start-5 lg:row-span-2">
              Notes
              <textarea
                value={form.notes}
                onChange={(event) =>
                  onFormChange((prev) => ({
                    ...prev,
                    notes: event.target.value,
                  }))
                }
                rows={6}
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm"
              />
            </label>
            <div className="hidden lg:block" />
          </div>
          <button
            type="submit"
            className="mt-2 rounded-md bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {isEditing ? "Update Activity" : "Save Activity"}
          </button>
        </form>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Activities</h3>
          {isLoading && <span className="text-xs text-zinc-400">Loading...</span>}
        </div>
        <div className="mt-4">
          {communications.length === 0 && !isLoading && (
            <p className="text-sm text-[color:var(--foreground)]/65">
              No activity entries yet.
            </p>
          )}
          {communications.length > 0 && (
            <div className="relative pl-6">
              <div className="absolute left-[9px] top-0 h-full w-px bg-zinc-200" />
              <div className="space-y-4">
                {communications.slice(0, 6).map((entry) => {
                  const linkedEvent = events.find(
                    (event) => event.id === entry.appointment_id,
                  );
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => onOpenDetails(entry)}
                      className="relative w-full text-left text-sm"
                    >
                      <div className="absolute left-[-19px] top-1 h-2.5 w-2.5 rounded-full border-2 border-[color:var(--primary)] bg-white" />
                      <div className="flex items-center justify-between text-xs text-[color:var(--foreground)]/60">
                        <span>{formatReadableDate(entry.date)}</span>
                        {linkedEvent && (
                          <span>{statusLabels[linkedEvent.status]}</span>
                        )}
                      </div>
                      <div className="mt-1 font-semibold text-[color:var(--foreground)]">
                        {formatFullName(
                          entry.patient_first_name,
                          entry.patient_middle_name,
                          entry.patient_last_name,
                        )}
                      </div>
                      <div className="mt-1 text-xs text-[color:var(--foreground)]/70">
                        {entry.current_dentist || "No dentist"} •{" "}
                        {entry.referral_type}
                      </div>
                      <div className="mt-1 text-xs text-[color:var(--foreground)]/70">
                        Called: {entry.date_called || "—"} • Emailed:{" "}
                        {entry.date_emailed || "—"}
                      </div>
                      <div className="mt-1 text-xs text-[color:var(--foreground)]/70">
                        Notes: {entry.notes || "—"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

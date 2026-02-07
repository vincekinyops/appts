import type { FormEvent } from "react";
import type { ActivityForm, Dentist, StaffMember } from "@/app/lib/types";
import { referralOptions } from "@/app/lib/constants";

type ActivityModalProps = {
  isOpen: boolean;
  form: ActivityForm;
  onFormChange: (updater: (prev: ActivityForm) => ActivityForm) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  dentists: Dentist[];
  staff: StaffMember[];
};

export function ActivityModal({
  isOpen,
  form,
  onFormChange,
  onClose,
  onSubmit,
  dentists,
  staff,
}: ActivityModalProps) {
  if (!isOpen) {
    return null;
  }

  const createdByOptions = [
    ...staff.map((member) => ({ id: member.id, name: member.name })),
    ...dentists.map((dentist) => ({ id: dentist.id, name: dentist.name })),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--foreground)]/20 px-4">
      <div className="w-full max-w-2xl rounded-md bg-white p-6 text-[color:var(--foreground)] shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">Add to Activities</h3>
            <p className="text-sm text-zinc-500">
              Confirm and edit the activity details before saving.
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

        <form className="activity-modal-form mt-6 grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-zinc-700">
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
            <div className="grid gap-4 sm:col-span-2 sm:grid-cols-3">
              <label className="grid gap-2 text-sm font-medium text-zinc-700">
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

          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
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
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
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
          </div>
        </div>
          <button
            type="submit"
            className="mt-2 rounded-md bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Save Activity
          </button>
        </form>
      </div>
    </div>
  );
}

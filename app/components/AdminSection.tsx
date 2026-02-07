import type { Dentist, StaffMember } from "@/app/lib/types";

type AdminSectionProps = {
  dentists: Dentist[];
  staff: StaffMember[];
  onAddDentist: (name: string) => void;
  onAddStaff: (name: string) => void;
};

export function AdminSection({
  dentists,
  staff,
  onAddDentist,
  onAddStaff,
}: AdminSectionProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Dentists</h2>
        <p className="text-sm text-[color:var(--foreground)]/70">
          Add dentists for activities and appointment context.
        </p>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const input = form.elements.namedItem("dentistName") as HTMLInputElement;
            const value = input.value.trim();
            if (!value) {
              return;
            }
            onAddDentist(value);
            input.value = "";
          }}
        >
          <input
            name="dentistName"
            type="text"
            placeholder="Dentist name"
            className="flex-1 rounded-md border border-zinc-200 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-md bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Add
          </button>
        </form>
        <div className="mt-4 space-y-2 text-sm">
          {dentists.length === 0 && (
            <p className="text-[color:var(--foreground)]/65">
              No dentists added yet.
            </p>
          )}
          {dentists.map((dentist) => (
            <div
              key={dentist.id}
              className="rounded-md border border-zinc-200 bg-[color:var(--background)] px-3 py-2"
            >
              {dentist.name}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Staff</h2>
        <p className="text-sm text-[color:var(--foreground)]/70">
          Add staff members who log activities.
        </p>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const input = form.elements.namedItem("staffName") as HTMLInputElement;
            const value = input.value.trim();
            if (!value) {
              return;
            }
            onAddStaff(value);
            input.value = "";
          }}
        >
          <input
            name="staffName"
            type="text"
            placeholder="Staff name"
            className="flex-1 rounded-md border border-zinc-200 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-md bg-[color:var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Add
          </button>
        </form>
        <div className="mt-4 space-y-2 text-sm">
          {staff.length === 0 && (
            <p className="text-[color:var(--foreground)]/65">
              No staff added yet.
            </p>
          )}
          {staff.map((member) => (
            <div
              key={member.id}
              className="rounded-md border border-zinc-200 bg-[color:var(--background)] px-3 py-2"
            >
              {member.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

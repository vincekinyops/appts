"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { ActivityModal } from "@/app/components/ActivityModal";
import { ActivityDetailsModal } from "@/app/components/ActivityDetailsModal";
import { ActivitiesSection } from "@/app/components/ActivitiesSection";
import { AdminSection } from "@/app/components/AdminSection";
import { AppointmentModal } from "@/app/components/AppointmentModal";
import { AppointmentsListModal } from "@/app/components/AppointmentsListModal";
import { CalendarSection } from "@/app/components/CalendarSection";
import { DashboardSection } from "@/app/components/DashboardSection";
import { Header } from "@/app/components/Header";
import { Tabs } from "@/app/components/Tabs";
import { Toast } from "@/app/components/Toast";
import { statusColors, statusOptions } from "@/app/lib/constants";
import {
  formatFullName,
  formatReadableDate,
  toIsoDate,
} from "@/app/lib/formatters";
import type {
  ActivityForm,
  AppointmentForm,
  AppointmentStatus,
  AppointmentType,
  CalendarEvent,
  CommunicationEntry,
  Dentist,
  StaffMember,
} from "@/app/lib/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "calendar" | "activities" | "dashboard" | "admin"
  >("dashboard");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [communications, setCommunications] = useState<CommunicationEntry[]>([]);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState<AppointmentForm>({
    type: "appointment",
    title: "",
    date: toIsoDate(new Date()),
    time: "",
    status: "pending",
    notes: "",
    patientFirstName: "",
    patientMiddleName: "",
    patientLastName: "",
  });
  const [communicationForm, setCommunicationForm] = useState<ActivityForm>({
    date: toIsoDate(new Date()),
    patientFirstName: "",
    patientMiddleName: "",
    patientLastName: "",
    schoolYear: "",
    currentDentist: "",
    language: "",
    dateCalled: "",
    dateEmailed: "",
    referralType: "TU0",
    notes: "",
    createdBy: "",
    appointmentId: "",
  });
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [appointmentsList, setAppointmentsList] = useState<{
    date: string | null;
    items: CalendarEvent[];
    anchorRect: DOMRect | null;
  }>({ date: null, items: [], anchorRect: null });
  const [activityDetails, setActivityDetails] =
    useState<CommunicationEntry | null>(null);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [activityModalForm, setActivityModalForm] = useState<ActivityForm>({
    date: toIsoDate(new Date()),
    patientFirstName: "",
    patientMiddleName: "",
    patientLastName: "",
    schoolYear: "",
    currentDentist: "",
    language: "",
    dateCalled: "",
    dateEmailed: "",
    referralType: "TU0",
    notes: "",
    createdBy: "",
    appointmentId: "",
  });
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
  };

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    });
    return map;
  }, [events]);

  const previousPatients = useMemo(() => {
    const seen = new Set<string>();
    return communications
      .map((entry) => ({
        first: entry.patient_first_name,
        middle: entry.patient_middle_name ?? "",
        last: entry.patient_last_name,
      }))
      .filter((patient) => {
        const key = formatFullName(
          patient.first,
          patient.middle,
          patient.last,
        ).toLowerCase();
        if (!key || seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
  }, [communications]);

  const appointmentOptions = useMemo(
    () =>
      [...events]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((event) => ({
          id: event.id,
          label: `${formatReadableDate(event.date)} • ${event.title} • ${formatFullName(
            event.patient_first_name,
            event.patient_middle_name,
            event.patient_last_name,
          )}`,
          event,
        })),
    [events],
  );

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoadError(
        "Supabase is not configured yet. Add your environment variables to connect.",
      );
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      const { data: eventData, error: eventError } = await supabase
        .from("calendar_events")
        .select("*")
        .order("date", { ascending: true });
      if (eventError) {
        setLoadError(eventError.message);
      } else {
        const normalizedEvents = (eventData ?? []).map((event) => {
          const status = (event.status ?? "pending") as AppointmentStatus;
          return {
            ...event,
            status,
            color: event.color ?? statusColors[status],
            event_type: (event.event_type ?? "appointment") as AppointmentType,
          };
        });
        setEvents(normalizedEvents);
      }

      const { data: commData, error: commError } = await supabase
        .from("communications")
        .select("*")
        .order("date", { ascending: false });
      if (commError) {
        setLoadError(commError.message);
      } else {
        setCommunications(commData ?? []);
      }

      const { data: dentistData, error: dentistError } = await supabase
        .from("dentists")
        .select("*")
        .order("name", { ascending: true });
      if (dentistError) {
        setLoadError(dentistError.message);
      } else {
        setDentists(dentistData ?? []);
      }

      const { data: staffData, error: staffError } = await supabase
        .from("staff")
        .select("*")
        .order("name", { ascending: true });
      if (staffError) {
        setLoadError(staffError.message);
      } else {
        setStaff(staffData ?? []);
      }

      setIsLoading(false);
    };

    loadData();
  }, []);

  const monthLabel = currentMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const calendarCells = Array.from({ length: 42 }, (_, index) => {
    const dayNumber = index - firstDayOfWeek + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      return null;
    }
    return new Date(year, month, dayNumber);
  });

  const openEventModal = (dateValue: string) => {
    if (dateValue < toIsoDate(new Date())) {
      showToast("error", "Past dates are view-only.");
      return;
    }
    setSelectedDate(dateValue);
    setSelectedEventId(null);
    setEventForm({
      type: "appointment",
      title: "",
      date: dateValue,
      time: "",
      status: "pending",
      notes: "",
      patientFirstName: "",
      patientMiddleName: "",
      patientLastName: "",
    });
    setIsEventModalOpen(true);
  };

  const openEditEventModal = (event: CalendarEvent) => {
    if (event.date < toIsoDate(new Date())) {
      showToast("error", "Past dates are view-only.");
      return;
    }
    setSelectedDate(event.date);
    setSelectedEventId(event.id);
    setEventForm({
      type: event.event_type ?? "appointment",
      title: event.title,
      date: event.date,
      time: event.time ?? "",
      status: event.status,
      notes: event.notes ?? "",
      patientFirstName: event.patient_first_name,
      patientMiddleName: event.patient_middle_name ?? "",
      patientLastName: event.patient_last_name,
    });
    setIsEventModalOpen(true);
  };

  const openAppointmentsListModal = (
    dateValue: string,
    items: CalendarEvent[],
    anchorRect: DOMRect,
  ) => {
    setSelectedDate(dateValue);
    setAppointmentsList({ date: dateValue, items, anchorRect });
  };

  const openActivityModalFromEvent = (event: CalendarEvent) => {
    setActivityModalForm({
      date: event.date,
      patientFirstName: event.patient_first_name,
      patientMiddleName: event.patient_middle_name ?? "",
      patientLastName: event.patient_last_name,
      schoolYear: "",
      currentDentist: "",
      language: "",
      dateCalled: "",
      dateEmailed: "",
      referralType: "TU0",
      notes: event.notes?.trim() || `Completed appointment: ${event.title}`,
      createdBy: "",
      appointmentId: event.id,
    });
    setIsActivityModalOpen(true);
  };

  const handleSaveEvent = async () => {
    if (!eventForm.title.trim()) {
      showToast("error", "Add a title.");
      return;
    }
    if (
      eventForm.type === "appointment" &&
      (!eventForm.patientFirstName.trim() || !eventForm.patientLastName.trim())
    ) {
      showToast("error", "Add patient first and last name.");
      return;
    }
    if (!isSupabaseConfigured) {
      showToast("error", "Supabase is not configured yet.");
      return;
    }
    const statusColor = statusColors[eventForm.status];
    const payload = {
      event_type: eventForm.type,
      title: eventForm.title.trim(),
      date: eventForm.date,
      time: eventForm.time.trim() || null,
      status: eventForm.status,
      color: statusColor,
      notes: eventForm.notes.trim() || null,
      patient_first_name: eventForm.patientFirstName.trim(),
      patient_middle_name: eventForm.patientMiddleName.trim() || null,
      patient_last_name: eventForm.patientLastName.trim(),
    };

    if (selectedEventId) {
      const { data, error } = await supabase
        .from("calendar_events")
        .update(payload)
        .eq("id", selectedEventId)
        .select()
        .single();
      if (error) {
        showToast("error", error.message);
        return;
      }
      setEvents((prev) =>
        prev.map((event) => (event.id === data.id ? data : event)),
      );
      setIsEventModalOpen(false);
      showToast(
        "success",
        eventForm.type === "event" ? "Event updated." : "Appointment updated.",
      );
      const hasActivity = communications.some(
        (entry) => entry.appointment_id === data.id,
      );
      if (data.status === "done" && !hasActivity) {
        openActivityModalFromEvent(data);
      }
      return;
    }

    const { data, error } = await supabase
      .from("calendar_events")
      .insert(payload)
      .select()
      .single();
    if (error) {
      showToast("error", error.message);
      return;
    }
    setEvents((prev) => [...prev, data]);
    setIsEventModalOpen(false);
    showToast(
      "success",
      eventForm.type === "event" ? "Event saved." : "Appointment saved.",
    );
    if (data.status === "done") {
      openActivityModalFromEvent(data);
    }
  };

  const saveActivity = async (
    formData: ActivityForm,
    options?: { resetForm?: boolean; closeModal?: boolean },
  ) => {
    if (!formData.patientFirstName.trim() || !formData.patientLastName.trim()) {
      showToast("error", "Add patient first and last name.");
      return;
    }
    if (!formData.createdBy.trim()) {
      showToast("error", "Add who created the activity.");
      return;
    }
    if (!isSupabaseConfigured) {
      showToast("error", "Supabase is not configured yet.");
      return;
    }
    let appointmentId = formData.appointmentId.trim() || null;

    if (!appointmentId) {
      const activityTitle = `Activity: ${formatFullName(
        formData.patientFirstName.trim(),
        formData.patientMiddleName.trim() || null,
        formData.patientLastName.trim(),
      )}`;
      const { data: newEvent, error: newEventError } = await supabase
        .from("calendar_events")
        .insert({
          title: activityTitle,
          date: formData.date,
          time: null,
          status: "done",
          color: statusColors.done,
          notes: formData.notes.trim() || null,
          patient_first_name: formData.patientFirstName.trim(),
          patient_middle_name: formData.patientMiddleName.trim() || null,
          patient_last_name: formData.patientLastName.trim(),
        })
        .select()
        .single();
      if (newEventError) {
        showToast("error", newEventError.message);
        return;
      }
      appointmentId = newEvent.id;
      setEvents((prev) => [...prev, newEvent]);
    } else {
      const { data: updatedEvents, error: updatedEventError } = await supabase
        .from("calendar_events")
        .update({
          status: "done",
          color: statusColors.done,
        })
        .eq("id", appointmentId)
        .select();
      if (updatedEventError) {
        showToast("error", updatedEventError.message);
        return;
      }
      if (!updatedEvents || updatedEvents.length === 0) {
        showToast("error", "Appointment update failed. Record not found.");
        return;
      }
      if (updatedEvents.length > 1) {
        showToast("error", "Appointment update failed. Multiple records updated.");
        return;
      }
      const updatedEvent = updatedEvents[0];
      setEvents((prev) =>
        prev.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event,
        ),
      );
    }

    const payload = {
      date: formData.date,
      patient_name: formatFullName(
        formData.patientFirstName.trim(),
        formData.patientMiddleName.trim() || null,
        formData.patientLastName.trim(),
      ),
      patient_first_name: formData.patientFirstName.trim(),
      patient_middle_name: formData.patientMiddleName.trim() || null,
      patient_last_name: formData.patientLastName.trim(),
      school_year: formData.schoolYear.trim(),
      current_dentist: formData.currentDentist.trim(),
      language: formData.language.trim(),
      date_called: formData.dateCalled || null,
      date_emailed: formData.dateEmailed || null,
      referral_type: formData.referralType,
      notes: formData.notes.trim() || null,
      created_by: formData.createdBy.trim(),
      appointment_id: appointmentId,
    };

    if (editingActivityId) {
      const { data, error } = await supabase
        .from("communications")
        .update(payload)
        .eq("id", editingActivityId)
        .select();
      if (error) {
        showToast("error", error.message);
        return;
      }
      if (!data || data.length === 0) {
        showToast("error", "Activity update failed. Record not found.");
        return;
      }
      if (data.length > 1) {
        showToast("error", "Activity update failed. Multiple records updated.");
        return;
      }
      setCommunications((prev) =>
        prev.map((entry) => (entry.id === data[0].id ? data[0] : entry)),
      );
      setEditingActivityId(null);
      showToast("success", "Activity updated.");
    } else {
      const { data, error } = await supabase
        .from("communications")
        .insert(payload)
        .select()
        .single();
      if (error) {
        showToast("error", error.message);
        return;
      }
      setCommunications((prev) => [data, ...prev]);
      showToast("success", "Activity saved.");
    }
    if (options?.resetForm) {
      setCommunicationForm({
        date: toIsoDate(new Date()),
        patientFirstName: "",
        patientMiddleName: "",
        patientLastName: "",
        schoolYear: "",
        currentDentist: "",
        language: "",
        dateCalled: "",
        dateEmailed: "",
        referralType: "TU0",
        notes: "",
        createdBy: "",
        appointmentId: "",
      });
    }
    if (options?.closeModal) {
      setIsActivityModalOpen(false);
    }
    setActiveTab("activities");
  };

  const beginEditActivity = (entry: CommunicationEntry) => {
    setActiveTab("activities");
    setActivityDetails(null);
    setEditingActivityId(entry.id);
    setCommunicationForm({
      date: entry.date,
      patientFirstName: entry.patient_first_name,
      patientMiddleName: entry.patient_middle_name ?? "",
      patientLastName: entry.patient_last_name,
      schoolYear: entry.school_year,
      currentDentist: entry.current_dentist ?? "",
      language: entry.language ?? "",
      dateCalled: entry.date_called ?? "",
      dateEmailed: entry.date_emailed ?? "",
      referralType: entry.referral_type,
      notes: entry.notes ?? "",
      createdBy: entry.created_by,
      appointmentId: entry.appointment_id ?? "",
    });
  };

  const handleCommunicationSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    await saveActivity(communicationForm, {
      resetForm: true,
    });
  };

  const handleActivityModalSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    await saveActivity(activityModalForm, {
      closeModal: true,
    });
  };

  const addDentist = async (name: string) => {
    if (!isSupabaseConfigured) {
      showToast("error", "Supabase is not configured yet.");
      return;
    }
    const { data, error } = await supabase
      .from("dentists")
      .insert({ name })
      .select()
      .single();
    if (error) {
      showToast("error", error.message);
      return;
    }
    setDentists((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    showToast("success", "Dentist added.");
  };

  const addStaff = async (name: string) => {
    if (!isSupabaseConfigured) {
      showToast("error", "Supabase is not configured yet.");
      return;
    }
    const { data, error } = await supabase
      .from("staff")
      .insert({ name })
      .select()
      .single();
    if (error) {
      showToast("error", error.message);
      return;
    }
    setStaff((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    showToast("success", "Staff added.");
  };

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 7,
    );
    return events
      .filter((event) => {
        const eventDate = new Date(`${event.date}T00:00:00`);
        return eventDate >= today && eventDate <= nextWeek;
      })
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }, [events]);

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <Header
          title="Calendar, Activities, and Insights"
          subtitle="Track appointments, log patient activities, and review trends in one place."
          tagline="CSDP Patient Operations"
        />

        <Tabs activeTab={activeTab} onChange={setActiveTab} />

        {loadError && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {loadError}
          </div>
        )}

        {toast && (
          <div className="pointer-events-none fixed right-6 top-6 z-50">
            <Toast
              type={toast.type}
              message={toast.message}
              onClose={() => setToast(null)}
            />
          </div>
        )}

        {activeTab === "calendar" && (
          <CalendarSection
            monthLabel={monthLabel}
            onPrevMonth={() =>
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), month - 1, 1),
              )
            }
            onNextMonth={() =>
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), month + 1, 1),
              )
            }
            calendarCells={calendarCells}
            eventsByDate={eventsByDate}
            onOpenDate={openEventModal}
            onEditEvent={openEditEventModal}
            onViewDayAppointments={openAppointmentsListModal}
            selectedDate={selectedDate}
            todayIso={toIsoDate(new Date())}
            toIsoDate={toIsoDate}
          />
        )}

        {activeTab === "activities" && (
          <ActivitiesSection
            form={communicationForm}
            onFormChange={setCommunicationForm}
            previousPatients={previousPatients}
            appointmentOptions={appointmentOptions}
            onSubmit={handleCommunicationSubmit}
            communications={communications}
            events={events}
            isLoading={isLoading}
            dentists={dentists}
            staff={staff}
            isEditing={Boolean(editingActivityId)}
            onOpenDetails={(entry) => setActivityDetails(entry)}
          />
        )}

        {activeTab === "dashboard" && (
          <DashboardSection
            communications={communications}
            events={events}
            upcomingEvents={upcomingEvents}
          />
        )}

        {activeTab === "admin" && (
          <AdminSection
            dentists={dentists}
            staff={staff}
            onAddDentist={addDentist}
            onAddStaff={addStaff}
          />
        )}
      </div>

      <AppointmentModal
        isOpen={isEventModalOpen}
        selectedEventId={selectedEventId}
        form={eventForm}
        onFormChange={setEventForm}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedDate(null);
        }}
        onSave={handleSaveEvent}
        previousPatients={previousPatients}
        isDateLocked={Boolean(selectedDate) && !selectedEventId}
      />

      <ActivityModal
        isOpen={isActivityModalOpen}
        form={activityModalForm}
        onFormChange={setActivityModalForm}
        onClose={() => {
          setIsActivityModalOpen(false);
          setSelectedDate(null);
        }}
        onSubmit={handleActivityModalSubmit}
        dentists={dentists}
        staff={staff}
      />

      <ActivityDetailsModal
        entry={activityDetails}
        onClose={() => setActivityDetails(null)}
        onEdit={beginEditActivity}
      />

      <AppointmentsListModal
        isOpen={Boolean(appointmentsList.date)}
        date={appointmentsList.date}
        appointments={appointmentsList.items}
        anchorRect={appointmentsList.anchorRect}
        onClose={() => {
          setAppointmentsList({ date: null, items: [], anchorRect: null });
          setSelectedDate(null);
        }}
      />
    </div>
  );
}

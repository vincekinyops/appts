export type AppointmentStatus = "pending" | "today" | "cancelled" | "done";

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time: string | null;
  status: AppointmentStatus;
  color: string;
  notes: string | null;
  patient_first_name: string;
  patient_middle_name: string | null;
  patient_last_name: string;
  created_at: string;
};

export type CommunicationEntry = {
  id: string;
  date: string;
  patient_first_name: string;
  patient_middle_name: string | null;
  patient_last_name: string;
  school_year: string;
  current_dentist: string;
  language: string;
  date_called: string | null;
  date_emailed: string | null;
  referral_type: string;
  notes: string | null;
  created_by: string;
  appointment_id: string | null;
  created_at: string;
};

export type PreviousPatient = {
  first: string;
  middle: string;
  last: string;
};

export type AppointmentOption = {
  id: string;
  label: string;
  event: CalendarEvent;
};

export type AppointmentForm = {
  title: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes: string;
  patientFirstName: string;
  patientMiddleName: string;
  patientLastName: string;
};

export type ActivityForm = {
  date: string;
  patientFirstName: string;
  patientMiddleName: string;
  patientLastName: string;
  schoolYear: string;
  currentDentist: string;
  language: string;
  dateCalled: string;
  dateEmailed: string;
  referralType: string;
  notes: string;
  createdBy: string;
  appointmentId: string;
};

export type Dentist = {
  id: string;
  name: string;
  created_at: string;
};

export type StaffMember = {
  id: string;
  name: string;
  created_at: string;
};

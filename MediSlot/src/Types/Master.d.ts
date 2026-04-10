declare namespace Master {
  interface AppointmentForm {
    name: string;
    phone: string;
    age: number;
    description: string;
    appointmentDate: string;
    timeSlotId?: number;
    timeSlot?: string;
    status: string;
  }
  interface Appointment extends AppointmentForm {
    id: number;
  }

  interface TimeSlotsForm {
    TimeSlot: string;
  }
  interface TimeSlot extends TimeSlotsForm {
    Id: number;
  }
  interface ReportResponse {
    totalAppointments: number;
    appearedCount: number;
    noShowCount: number;
    appointments: Master.Appointment[];
  }
}

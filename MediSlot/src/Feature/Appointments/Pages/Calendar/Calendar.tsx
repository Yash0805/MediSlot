import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg } from '@fullcalendar/core';
import { useMemo, useCallback, type FC } from 'react';
import { useAppointmentQuery } from '../../queries';
import '../Calendar/Calendar.css';

const buildDateTime = (date: string, time: string) => {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute, second] = time.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute, second || 0);
};

const Calendar: FC = () => {
  const { data, isLoading } = useAppointmentQuery();
  const events = useMemo(() => {
    if (!data) return [];
    return data.map((a) => ({
      id: String(a.id),
      title: `${a.name} - ${a.timeSlot}`,
      start: buildDateTime(a.appointmentDate,   a.timeSlot ?? '00:00:00'),
      color:
        a.status === 'Appeared'
          ? '#22c55e'
          : a.status === 'NoShow'
          ? '#ef4444'
          : '#2563EB',
    }));
  }, [data]);

  const handleEventClick = useCallback((info: EventClickArg) => {
    alert(
      `Patient: ${info.event.title}\nTime: ${info.event.start?.toLocaleString()}`
    );
  }, []);

  if (isLoading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        views={{
          dayGridMonth: { buttonText: 'Month' },
          timeGridWeek: { buttonText: 'Week' },
          timeGridDay: { buttonText: 'Day' },
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }}
        events={events}
        eventClick={handleEventClick}
        height="80vh"
      />
    </div>
  );
};

export default Calendar;
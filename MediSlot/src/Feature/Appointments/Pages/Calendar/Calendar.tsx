import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg } from '@fullcalendar/core';
import { useMemo, useCallback, type FC } from 'react';
import { useAppointmentQuery } from '../../queries';
import '../Calendar/Calendar.css'

const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('T')[0].split('-');
  return `${year}-${month}-${day}`;
};

const Calendar: FC = () => {
  const { data, isLoading } = useAppointmentQuery();
  const events = useMemo(() => {
    if (!data) return [];

    return data.map((a) => ({
      id: String(a.id),
      title: a.name,
      date: formatDate(a.appointmentDate),
      color: a.status === 'Appeared' ? '#22c55e' : a.status === 'NoShow' ? '#ef4444' : '#2563EB' ,
    }));
  }, [data]);

  const handleEventClick = useCallback((info: EventClickArg) => {
    alert(`Patient: ${info.event.title}`);
  }, []);

  if (isLoading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        height="80vh"
      />
    </div>
  );
};

export default Calendar;
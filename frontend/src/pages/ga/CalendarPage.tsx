import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer, type View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { bookingsApi } from '@/lib/apiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import type { CalendarEvent } from '@/lib/types';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Clock, MapPin, Users, FileText, DoorOpen } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup localizer
const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Custom event styling
const eventStyleGetter = (event: any) => {
  const style: React.CSSProperties = {
    backgroundColor: '#3b82f6',
    borderRadius: '6px',
    opacity: 0.9,
    color: 'white',
    border: 'none',
    display: 'block',
    fontSize: '0.875rem',
    padding: '4px 8px',
  };

  return { style };
};

export const CalendarPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);

  useEffect(() => {
    fetchCalendarEvents();
  }, [date, view]);

  const fetchCalendarEvents = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Calculate date range based on current view
      const startDate = getViewStartDate(date, view);
      const endDate = getViewEndDate(date, view);

      const response = await bookingsApi.getCalendar(
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd')
      );

      if (response.data.success && response.data.data) {
        const formattedEvents = formatEventsForCalendar(response.data.data);
        setEvents(formattedEvents);
      } else {
        setEvents([]);
      }
    } catch (err: any) {
      console.error('Calendar fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load calendar events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getViewStartDate = (date: Date, view: View): Date => {
    const start = new Date(date);
    switch (view) {
      case 'month':
        start.setDate(1);
        start.setDate(start.getDate() - start.getDay());
        break;
      case 'week':
        start.setDate(start.getDate() - start.getDay());
        break;
      case 'day':
        break;
      default:
        break;
    }
    return start;
  };

  const getViewEndDate = (date: Date, view: View): Date => {
    const end = new Date(date);
    switch (view) {
      case 'month':
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        end.setDate(end.getDate() + (6 - end.getDay()));
        break;
      case 'week':
        end.setDate(end.getDate() + 6);
        break;
      case 'day':
        break;
      default:
        break;
    }
    return end;
  };

  const formatEventsForCalendar = (calendarEvents: CalendarEvent[]) => {
    return calendarEvents.map((event) => {
      // Parse ISO datetime strings from API
      const startDateTime = new Date(event.start);
      const endDateTime = new Date(event.end);

      return {
        id: event.id,
        title: `${event.extendedProps.room_name} - ${event.extendedProps.purpose}`,
        start: startDateTime,
        end: endDateTime,
        resource: {
          id: event.id,
          roomId: event.resourceId,
          roomName: event.extendedProps.room_name,
          userName: event.extendedProps.user_name,
          userEmail: event.extendedProps.user_email,
          division: event.extendedProps.division,
          purpose: event.extendedProps.purpose,
        },
      };
    });
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  if (loading) return <LoadingSpinner text="Loading calendar..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Booking Calendar</h1>
        <p className="text-slate-400 mt-1">View all room bookings in calendar view</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{events.length}</div>
              <p className="text-sm text-slate-400 mt-1">Total Bookings</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {events.filter(e => {
                  const now = new Date();
                  return e.start <= now && e.end >= now;
                }).length}
              </div>
              <p className="text-sm text-slate-400 mt-1">Ongoing</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {events.filter(e => e.start > new Date()).length}
              </div>
              <p className="text-sm text-slate-400 mt-1">Upcoming</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-400">
                {events.filter(e => e.end < new Date()).length}
              </div>
              <p className="text-sm text-slate-400 mt-1">Past</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Card */}
      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-800">
          <CardTitle className="text-white flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-400" />
            Calendar View
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="calendar-container" style={{ height: '600px' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={handleViewChange}
              date={date}
              onNavigate={handleNavigate}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              views={['month', 'week', 'day', 'agenda']}
              popup
              style={{ height: '100%' }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-400" />
              Booking Details
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              View booking information
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DoorOpen className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg">
                    {selectedEvent.resource.roomName}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {selectedEvent.resource.purpose}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">
                    <span className="text-slate-500">Booked by:</span> {selectedEvent.resource.userName}
                  </span>
                </div>

                {selectedEvent.resource.userEmail && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">
                      <span className="text-slate-500">Email:</span> {selectedEvent.resource.userEmail}
                    </span>
                  </div>
                )}

                {selectedEvent.resource.division && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">
                      <span className="text-slate-500">Division:</span> {selectedEvent.resource.division}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">
                    {format(selectedEvent.start, 'PPP')} • {format(selectedEvent.start, 'HH:mm')} - {format(selectedEvent.end, 'HH:mm')}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <Button 
                  onClick={() => setShowEventDialog(false)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Custom CSS for Calendar */}
      <style>{`
        .calendar-container .rbc-calendar {
          background: transparent;
          color: #e2e8f0;
          font-family: inherit;
        }
        
        .rbc-header {
          padding: 12px 4px;
          font-weight: 600;
          border-bottom: 1px solid #334155;
          background: #1e293b;
          color: #cbd5e1;
        }
        
        .rbc-today {
          background-color: rgba(59, 130, 246, 0.1);
        }
        
        .rbc-off-range-bg {
          background: #0f172a;
        }
        
        .rbc-date-cell {
          padding: 8px;
          color: #94a3b8;
        }
        
        .rbc-now .rbc-button-link {
          color: #60a5fa;
          font-weight: 700;
        }
        
        .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
          border: 1px solid #334155;
          background: #0f172a;
        }
        
        .rbc-day-bg {
          border-left: 1px solid #334155;
        }
        
        .rbc-month-row {
          border-top: 1px solid #334155;
        }
        
        .rbc-toolbar {
          padding: 16px;
          margin-bottom: 16px;
          background: #1e293b;
          border-radius: 8px;
          border: 1px solid #334155;
        }
        
        .rbc-toolbar button {
          color: #cbd5e1;
          padding: 8px 16px;
          border-radius: 6px;
          border: 1px solid #475569;
          background: #334155;
          transition: all 0.2s;
        }
        
        .rbc-toolbar button:hover {
          background: #475569;
          color: white;
        }
        
        .rbc-toolbar button.rbc-active {
          background: linear-gradient(to right, #2563eb, #1d4ed8);
          border-color: #2563eb;
          color: white;
        }
        
        .rbc-event {
          padding: 4px 8px;
          background: #3b82f6;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
        }
        
        .rbc-event:hover {
          background: #2563eb;
        }
        
        .rbc-time-slot {
          border-top: 1px solid #334155;
        }
        
        .rbc-time-content {
          border-top: 1px solid #334155;
        }
        
        .rbc-agenda-view table {
          border: 1px solid #334155;
        }
        
        .rbc-agenda-view .rbc-agenda-table {
          color: #cbd5e1;
        }
        
        .rbc-agenda-date-cell,
        .rbc-agenda-time-cell {
          color: #94a3b8;
        }
        
        .rbc-agenda-event-cell {
          color: #e2e8f0;
        }
      `}</style>
    </div>
  );
};


// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// export const CalendarPage = () => {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Booking Calendar</h1>
//         <p className="text-muted-foreground">View all room bookings in calendar view</p>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Calendar View</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="py-16 text-center text-muted-foreground">
//             <p>📅 Calendar component will be implemented here</p>
//             <p className="text-sm mt-2">
//               Use libraries like FullCalendar or React Big Calendar
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

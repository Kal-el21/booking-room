import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const CalendarPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Booking Calendar</h1>
        <p className="text-muted-foreground">View all room bookings in calendar view</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-16 text-center text-muted-foreground">
            <p>📅 Calendar component will be implemented here</p>
            <p className="text-sm mt-2">
              Use libraries like FullCalendar or React Big Calendar
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

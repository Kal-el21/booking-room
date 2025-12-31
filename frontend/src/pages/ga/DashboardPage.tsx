import { useEffect, useState } from 'react';
import { dashboardApi } from '@/lib/apiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { formatDateTime, getStatusColor } from '@/lib/utils';
import { DoorOpen, Clock, Calendar, CheckCircle } from 'lucide-react';
import type { DashboardStats, RoomRequest, RoomBooking } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const GADashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingRequests, setPendingRequests] = useState<RoomRequest[]>([]);
  const [todayBookings, setTodayBookings] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getStats();
      if (response.data.success && response.data.data) {
        const data = response.data.data as any;
        setStats(data.stats);
        setPendingRequests(data.pending_requests || []);
        setTodayBookings(data.today_bookings || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">GA Dashboard</h1>
        <p className="text-muted-foreground">Overview of room bookings and requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <DoorOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_rooms || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.available_rooms || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending_requests || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.today_bookings || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pending Requests</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate('/ga/requests')}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No pending requests</p>
          ) : (
            <div className="space-y-4">
              {pendingRequests.slice(0, 5).map((request) => (
                <div
                  key={request.id_request}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{request.purpose}</p>
                    <p className="text-sm text-muted-foreground">
                      By {request.user?.name} ({request.user?.division})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      📅 {formatDateTime(request.date, request.start_time)} - {request.end_time.substring(0, 5)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      👥 {request.required_capacity} people
                    </p>
                  </div>
                  <Badge className={getStatusColor('pending')}>Pending</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Today's Bookings</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate('/ga/calendar')}>
            View Calendar
          </Button>
        </CardHeader>
        <CardContent>
          {todayBookings.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No bookings today</p>
          ) : (
            <div className="space-y-4">
              {todayBookings.map((booking) => (
                <div
                  key={booking.id_booking}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{booking.room?.room_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.request?.user?.name} - {booking.request?.purpose}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ⏰ {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}
                    </p>
                  </div>
                  <Badge className={getStatusColor('approved')}>Active</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
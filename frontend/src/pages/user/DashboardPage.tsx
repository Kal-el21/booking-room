import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { dashboardApi, bookingsApi } from '@/lib/apiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { formatDateTime, getStatusColor } from '@/lib/utils';
import { Calendar, FileText, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import type { DashboardStats, RoomBooking } from '@/lib/types';

export const UserDashboardPage = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<RoomBooking[]>([]);
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
        setStats(response.data.data.stats);
        setUpcomingBookings(response.data.data.upcoming_bookings || []);
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 shadow-xl shadow-blue-500/20">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-blue-100">Here's your booking overview for today</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Requests</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FileText className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats?.total_requests || 0}</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              All time requests
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Pending</CardTitle>
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats?.pending_requests || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/10 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Approved</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats?.approved_requests || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Successfully approved</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Upcoming</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Calendar className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats?.upcoming_bookings || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Next bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            Upcoming Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium">No upcoming bookings</p>
              <p className="text-slate-600 text-sm mt-1">Create a new request to book a room</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id_booking}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/30 p-4 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-white">{booking.room?.room_name}</p>
                      <p className="text-sm text-slate-400 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {formatDateTime(booking.date, booking.start_time)} - {booking.end_time.substring(0, 5)}
                      </p>
                      <p className="text-sm text-slate-500">{booking.request?.purpose}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20">
                    Confirmed
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
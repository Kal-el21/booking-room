import { useEffect, useState } from 'react';
import { dashboardApi } from '@/lib/apiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { formatDateTime, getStatusColor } from '@/lib/utils';
import { DoorOpen, Clock, Calendar, CheckCircle, ArrowRight, Users } from 'lucide-react';
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 shadow-xl shadow-blue-500/20">
        <h1 className="text-3xl font-bold text-white mb-2">GA Dashboard</h1>
        <p className="text-blue-100">Overview of room bookings and requests management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Rooms</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <DoorOpen className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats?.total_rooms || 0}</div>
            <p className="text-xs text-slate-500 mt-1">All rooms in system</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/10 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Available Rooms</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats?.available_rooms || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Ready for booking</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Pending Requests</CardTitle>
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats?.pending_requests || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Today's Bookings</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Calendar className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats?.today_bookings || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Active bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-400" />
              Pending Requests
            </CardTitle>
            <p className="text-sm text-slate-400 mt-1">Review and approve booking requests</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/ga/requests')}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium">No pending requests</p>
              <p className="text-slate-600 text-sm mt-1">All requests have been processed</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 5).map((request) => (
                <div
                  key={request.id_request}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/30 p-4 hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => navigate('/ga/requests')}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-white">{request.purpose}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {request.user?.name}
                        </span>
                        <span>•</span>
                        <span>{request.user?.division}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDateTime(request.date, request.start_time)} - {request.end_time.substring(0, 5)}
                        </span>
                        <span>•</span>
                        <span>{request.required_capacity} people</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20">
                    Pending
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Bookings */}
      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-400" />
              Today's Bookings
            </CardTitle>
            <p className="text-sm text-slate-400 mt-1">Active bookings for today</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/ga/calendar')}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            View Calendar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {todayBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium">No bookings today</p>
              <p className="text-slate-600 text-sm mt-1">All rooms are available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayBookings.map((booking) => (
                <div
                  key={booking.id_booking}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/30 p-4 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DoorOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-white">{booking.room?.room_name}</p>
                      <p className="text-sm text-slate-400">
                        {booking.request?.user?.name} - {booking.request?.purpose}
                      </p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20">
                    Active
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
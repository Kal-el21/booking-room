import { useEffect, useState } from 'react';
import { requestsApi } from '@/lib/apiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { formatDateTime, getStatusColor } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { RoomRequest } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const MyRequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<RoomRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const response = await requestsApi.getAll({ my_requests: true });
      if (response.data.success && response.data.data) {
        setRequests(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = (status: string) => {
    return requests.filter((req) => req.status === status);
  };

  if (loading) return <LoadingSpinner text="Loading your requests..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Requests</h1>
          <p className="text-muted-foreground">View and manage your room booking requests</p>
        </div>
        <Button onClick={() => navigate('/create-request')}>
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({filterRequests('pending').length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({filterRequests('approved').length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({filterRequests('rejected').length})</TabsTrigger>
        </TabsList>

        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {(status === 'all' ? requests : filterRequests(status)).map((request) => (
              <Card key={request.id_request}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{request.purpose}</h3>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>📅 {formatDateTime(request.date, request.start_time)} - {request.end_time.substring(0, 5)}</p>
                        <p>👥 Capacity: {request.required_capacity} people</p>
                        {request.notes && <p>📝 {request.notes}</p>}
                        {request.rejected_reason && (
                          <p className="text-destructive">❌ Rejected: {request.rejected_reason}</p>
                        )}
                        {request.booking && (
                          <p className="text-green-600">✅ Room: {request.booking.room?.room_name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(status === 'all' ? requests : filterRequests(status)).length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No {status !== 'all' && status} requests found
              </p>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
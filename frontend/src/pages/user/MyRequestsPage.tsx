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
import { Plus, Calendar, Users, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <FileText className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'approved':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  if (loading) return <LoadingSpinner text="Loading your requests..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Requests</h1>
          <p className="text-slate-400 mt-1">View and manage your room booking requests</p>
        </div>
        <Button 
          onClick={() => navigate('/create-request')}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-slate-900 border border-slate-800 p-1">
          <TabsTrigger 
            value="all"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white text-slate-400"
          >
            All ({requests.length})
          </TabsTrigger>
          <TabsTrigger 
            value="pending"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white text-slate-400"
          >
            Pending ({filterRequests('pending').length})
          </TabsTrigger>
          <TabsTrigger 
            value="approved"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white text-slate-400"
          >
            Approved ({filterRequests('approved').length})
          </TabsTrigger>
          <TabsTrigger 
            value="rejected"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white text-slate-400"
          >
            Rejected ({filterRequests('rejected').length})
          </TabsTrigger>
        </TabsList>

        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {(status === 'all' ? requests : filterRequests(status)).map((request) => (
              <Card key={request.id_request} className="bg-slate-900/80 border-slate-800 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        request.status === 'pending' ? 'bg-yellow-500/10' :
                        request.status === 'approved' ? 'bg-green-500/10' :
                        'bg-red-500/10'
                      }`}>
                        {getStatusIcon(request.status)}
                      </div>
                      
                      <div className="space-y-3 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-semibold text-white text-lg">{request.purpose}</h3>
                          <Badge className={getStatusBadgeClass(request.status)}>
                            {request.status.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Calendar className="h-4 w-4 text-blue-400" />
                            <span>{formatDateTime(request.date, request.start_time)} - {request.end_time.substring(0, 5)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Users className="h-4 w-4 text-blue-400" />
                            <span>Capacity: {request.required_capacity} people</span>
                          </div>
                        </div>

                        {request.notes && (
                          <div className="flex items-start gap-2 text-sm bg-slate-800/30 p-3 rounded-lg">
                            <FileText className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-400">{request.notes}</span>
                          </div>
                        )}

                        {request.rejected_reason && (
                          <div className="flex items-start gap-2 text-sm bg-red-500/5 border border-red-500/20 p-3 rounded-lg">
                            <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-red-400 font-medium">Rejected Reason:</p>
                              <p className="text-red-300">{request.rejected_reason}</p>
                            </div>
                          </div>
                        )}

                        {request.booking && (
                          <div className="flex items-center gap-2 text-sm bg-green-500/5 border border-green-500/20 p-3 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-green-400 font-medium">
                              Room Assigned: {request.booking.room?.room_name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {(status === 'all' ? requests : filterRequests(status)).length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-10 w-10 text-slate-600" />
                </div>
                <p className="text-slate-400 font-medium text-lg">
                  No {status !== 'all' && status} requests found
                </p>
                <p className="text-slate-600 text-sm mt-2">
                  {status === 'all' ? 'Create your first request to get started' : `You don't have any ${status} requests yet`}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
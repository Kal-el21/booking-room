import { useEffect, useState } from 'react';
import { requestsApi } from '@/lib/apiService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { formatDateTime, getStatusColor } from '@/lib/utils';
import { toast } from 'sonner';
import type { RoomRequest, Room } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Clock, Calendar, Users, FileText, Building, Loader2 } from 'lucide-react';

export const PendingRequestsPage = () => {
  const [requests, setRequests] = useState<RoomRequest[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RoomRequest | null>(null);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [rejectedReason, setRejectedReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await requestsApi.getAll({ status: 'pending', upcoming_only: true });
      if (response.data.success && response.data.data) {
        setRequests(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = async (request: RoomRequest) => {
    setSelectedRequest(request);
    setSelectedRoom('');
    
    try {
      const response = await requestsApi.getAvailableRooms(request.id_request);
      if (response.data.success && response.data.data) {
        setAvailableRooms(response.data.data);
        setShowApproveDialog(true);
      }
    } catch (err: any) {
      toast.error('Error', {
        description: 'Failed to load available rooms',
      });
    }
  };

  const handleApprove = async () => {
    if (!selectedRequest || !selectedRoom) return;

    setActionLoading(true);
    try {
      await requestsApi.approve(selectedRequest.id_request, parseInt(selectedRoom));
      
      toast.success('Request approved!', {
        description: 'Booking has been created successfully.',
      });
      
      setShowApproveDialog(false);
      fetchPendingRequests();
    } catch (err: any) {
      toast.error('Failed to approve', {
        description: err.response?.data?.message || 'An error occurred',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (request: RoomRequest) => {
    setSelectedRequest(request);
    setRejectedReason('');
    setShowRejectDialog(true);
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectedReason.trim()) return;

    setActionLoading(true);
    try {
      await requestsApi.reject(selectedRequest.id_request, rejectedReason);
      
      toast.success('Request rejected', {
        description: 'The user will be notified.',
      });
      
      setShowRejectDialog(false);
      fetchPendingRequests();
    } catch (err: any) {
      toast.error('Failed to reject', {
        description: err.response?.data?.message || 'An error occurred',
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading pending requests..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Pending Requests</h1>
        <p className="text-slate-400 mt-1">Review and approve room booking requests</p>
      </div>

      {requests.length === 0 ? (
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-10 w-10 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium text-lg">No pending requests</p>
              <p className="text-slate-600 text-sm mt-2">All requests have been processed</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id_request} className="bg-slate-900/80 border-slate-800 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-yellow-400" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-semibold text-white text-lg">{request.purpose}</h3>
                        <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                          Pending
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Users className="h-4 w-4 text-blue-400" />
                          <span>{request.user?.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Building className="h-4 w-4 text-blue-400" />
                          <span>{request.user?.division}</span>
                        </div>
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
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApproveClick(request)}
                      className="bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 hover:text-green-300"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRejectClick(request)}
                      className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:text-red-300"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Approve Request</DialogTitle>
            <DialogDescription className="text-slate-400">Select a room for this booking</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Available Rooms</Label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                  {availableRooms.map((room) => (
                    <SelectItem 
                      key={room.id_room} 
                      value={room.id_room.toString()}
                      className="text-slate-300 focus:bg-slate-800 focus:text-white"
                    >
                      {room.room_name} (Capacity: {room.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowApproveDialog(false)}
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleApprove} 
                disabled={!selectedRoom || actionLoading}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Reject Request</DialogTitle>
            <DialogDescription className="text-slate-400">Provide a reason for rejection</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Rejection Reason *</Label>
              <Textarea
                placeholder="e.g., Room not available at requested time..."
                value={rejectedReason}
                onChange={(e) => setRejectedReason(e.target.value)}
                rows={4}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-red-500/20"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowRejectDialog(false)}
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={!rejectedReason.trim() || actionLoading}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
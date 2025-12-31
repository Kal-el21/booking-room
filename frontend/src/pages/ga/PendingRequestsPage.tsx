import { useEffect, useState } from 'react';
import { requestsApi } from '@/lib/apiService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { formatDateTime, getStatusColor } from '@/lib/utils';
import { toast } from 'sonner'; // ✅ CHANGED
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
import { CheckCircle, XCircle } from 'lucide-react';

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
        <h1 className="text-3xl font-bold">Pending Requests</h1>
        <p className="text-muted-foreground">Review and approve room booking requests</p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <p className="text-center text-muted-foreground">No pending requests</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id_request}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{request.purpose}</h3>
                      <Badge className={getStatusColor('pending')}>Pending</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <p>👤 {request.user?.name}</p>
                      <p>🏢 {request.user?.division}</p>
                      <p>📅 {formatDateTime(request.date, request.start_time)} - {request.end_time.substring(0, 5)}</p>
                      <p>👥 {request.required_capacity} people</p>
                    </div>
                    {request.notes && (
                      <p className="text-sm text-muted-foreground">📝 {request.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => handleApproveClick(request)}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleRejectClick(request)}
                    >
                      <XCircle className="mr-1 h-4 w-4" />
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>Select a room for this booking</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Available Rooms</Label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map((room) => (
                    <SelectItem key={room.id_room} value={room.id_room.toString()}>
                      {room.room_name} (Capacity: {room.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleApprove} disabled={!selectedRoom || actionLoading}>
                {actionLoading && <LoadingSpinner />}
                Approve
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>Provide a reason for rejection</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rejection Reason *</Label>
              <Textarea
                placeholder="e.g., Room not available at requested time..."
                value={rejectedReason}
                onChange={(e) => setRejectedReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectedReason.trim() || actionLoading}
              >
                {actionLoading && <LoadingSpinner />}
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomsApi } from '@/lib/apiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner'; // ✅ CHANGED
import { Loader2, ArrowLeft } from 'lucide-react';

export const CreateRoomPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    room_name: '',
    capacity: '',
    location: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await roomsApi.create({
        room_name: formData.room_name,
        capacity: parseInt(formData.capacity),
        location: formData.location,
        description: formData.description || undefined,
        status: 'available',
        is_active: true,
      });

      if (response.data.success) {
        toast.success('Room created!', {
          description: 'The room has been created successfully.',
        });
        navigate('/admin/rooms');
      }
    } catch (err: any) {
      toast.error('Failed to create room', {
        description: err.response?.data?.message || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Room</h1>
          <p className="text-muted-foreground">Add a new meeting room</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room_name">Room Name *</Label>
              <Input
                id="room_name"
                name="room_name"
                placeholder="e.g., Meeting Room A"
                value={formData.room_name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  placeholder="10"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., Floor 3, Building A"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="e.g., Room with projector, whiteboard, AC..."
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Room
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
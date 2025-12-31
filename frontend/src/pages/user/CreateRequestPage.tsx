import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestsApi } from '@/lib/apiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner'; // ✅ CHANGED
import { Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

export const CreateRequestPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    required_capacity: '',
    purpose: '',
    notes: '',
    date: '',
    start_time: '',
    end_time: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await requestsApi.create({
        required_capacity: parseInt(formData.required_capacity),
        purpose: formData.purpose,
        notes: formData.notes || undefined,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
      });

      if (response.data.success) {
        toast.success('Request submitted!', {
          description: 'Your room booking request has been submitted successfully.',
        });
        navigate('/my-requests');
      }
    } catch (err: any) {
      toast.error('Failed to submit request', {
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

  const minDate = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Booking Request</h1>
          <p className="text-muted-foreground">Submit a new room booking request</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="required_capacity">Required Capacity *</Label>
                <Input
                  id="required_capacity"
                  name="required_capacity"
                  type="number"
                  min="1"
                  placeholder="10"
                  value={formData.required_capacity}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  min={minDate}
                  value={formData.date}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time *</Label>
                <Input
                  id="start_time"
                  name="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_time">End Time *</Label>
                <Input
                  id="end_time"
                  name="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Textarea
                id="purpose"
                name="purpose"
                placeholder="e.g., Monthly team meeting"
                value={formData.purpose}
                onChange={handleChange}
                required
                disabled={loading}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="e.g., Need projector and whiteboard"
                value={formData.notes}
                onChange={handleChange}
                disabled={loading}
                rows={3}
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
                Submit Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestsApi } from '@/lib/apiService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Users, Calendar, Clock, FileText, Send } from 'lucide-react';
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Create Booking Request</h1>
          <p className="text-slate-400 mt-1">Submit a new room booking request</p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-slate-800">
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            Request Details
          </CardTitle>
          <CardDescription className="text-slate-400">
            Fill in the details for your room booking request
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Capacity & Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="required_capacity" className="text-slate-300 font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  Required Capacity *
                </Label>
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
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-slate-300 font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  Date *
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  min={minDate}
                  value={formData.date}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
                />
              </div>
            </div>

            {/* Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="start_time" className="text-slate-300 font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  Start Time *
                </Label>
                <Input
                  id="start_time"
                  name="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_time" className="text-slate-300 font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  End Time *
                </Label>
                <Input
                  id="end_time"
                  name="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
                />
              </div>
            </div>

            {/* Purpose */}
            <div className="space-y-2">
              <Label htmlFor="purpose" className="text-slate-300 font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-400" />
                Purpose *
              </Label>
              <Textarea
                id="purpose"
                name="purpose"
                placeholder="e.g., Monthly team meeting, Client presentation, Workshop"
                value={formData.purpose}
                onChange={handleChange}
                required
                disabled={loading}
                rows={3}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-300 font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-400" />
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="e.g., Need projector, whiteboard, and video conferencing equipment"
                value={formData.notes}
                onChange={handleChange}
                disabled={loading}
                rows={3}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={loading}
                className="flex-1 border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Request
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-500/5 border-blue-500/20 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-300">Important Information</p>
              <p className="text-sm text-blue-200/70">
                Your request will be reviewed by the GA team. You'll receive a notification once your request is processed. 
                Make sure all information is accurate before submitting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
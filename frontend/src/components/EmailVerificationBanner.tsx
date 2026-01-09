// components/EmailVerificationBanner.tsx
import { useState } from 'react';
import { authApi } from '@/lib/apiService';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const EmailVerificationBanner = ({ user }) => {
  const [sending, setSending] = useState(false);

  if (user?.email_verified_at) {
    return null; // Already verified
  }

  const handleResend = async () => {
    setSending(true);
    try {
      const response = await authApi.resendVerificationEmail();
      if (response.data.success) {
        toast.success('Verification email sent! Please check your inbox.');
      }
    } catch (err) {
      toast.error('Failed to send verification email');
    } finally {
      setSending(false);
    }
  };

  return (
    <Alert className="bg-yellow-500/10 border-yellow-500/20">
      <Mail className="h-4 w-4 text-yellow-400" />
      <AlertDescription className="text-yellow-200">
        <div className="flex items-center justify-between">
          <span>Your email address is not verified. Please check your inbox.</span>
          <Button
            size="sm"
            onClick={handleResend}
            disabled={sending}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            {sending ? 'Sending...' : 'Resend Email'}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
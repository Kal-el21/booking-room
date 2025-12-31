import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ShieldAlert } from 'lucide-react';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const getDashboardPath = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'GA':
        return '/ga/dashboard';
      case 'room_admin':
        return '/admin/rooms';
      case 'user':
        return '/dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-2">
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => navigate(getDashboardPath())}>
            Go to My Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuthStore } from '@/store/authStore';
import { Navigate } from 'react-router-dom';

export const LoginPage = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    // Redirect based on user role
    switch (user.role) {
      case 'GA':
        return <Navigate to="/ga/dashboard" replace />;
      case 'room_admin':
        return <Navigate to="/admin/rooms" replace />;
      case 'user':
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/10 p-4">
      <LoginForm />
    </div>
  );
};
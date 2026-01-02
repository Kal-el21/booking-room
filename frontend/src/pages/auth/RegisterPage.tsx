import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuthStore } from '@/store/authStore';
import { Navigate } from 'react-router-dom';

export const RegisterPage = () => {
  const { isAuthenticated, user } = useAuthStore();

  // If user is already authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
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
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      <RegisterForm />
    </div>
  );
};
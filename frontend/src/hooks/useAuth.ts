import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/apiService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // ✅ CHANGED

export const useAuth = () => {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      if (response.data.success && response.data.data) {
        setAuth(response.data.data.user, response.data.data.token);
        
        // ✅ CHANGED - Sonner toast
        toast.success(`Welcome back, ${response.data.data.user.name}!`, {
          description: 'Login successful'
        });
        
        // Redirect based on role
        if (response.data.data.user.role === 'GA') {
          navigate('/ga/dashboard');
        } else if (response.data.data.user.role === 'room_admin') {
          navigate('/admin/rooms');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      // ✅ CHANGED - Sonner toast
      toast.error('Login failed', {
        description: error.response?.data?.message || 'Invalid credentials'
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      navigate('/login');
      // ✅ CHANGED - Sonner toast
      toast('Logged out successfully');
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  };
};
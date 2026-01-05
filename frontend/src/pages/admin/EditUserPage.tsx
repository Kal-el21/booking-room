import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usersApi } from '@/lib/apiService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  User,
  Mail,
  Briefcase,
  Shield,
  Save,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import type { User as UserType } from '@/lib/types';

export const EditUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<UserType | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    division: '',
    role: 'user' as 'user' | 'room_admin' | 'GA',
    is_active: true,
  });

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getById(parseInt(id!));
      if (response.data.success && response.data.data) {
        const userData = response.data.data;
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email,
          division: userData.division || '',
          role: userData.role,
          is_active: userData.is_active,
        });
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to load user';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    try {
      const response = await usersApi.updateProfile(parseInt(id), formData);
      if (response.data.success) {
        toast.success('User updated successfully!');
        navigate('/admin/users');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update user';
      const validationErrors = err.response?.data?.errors;
      
      if (validationErrors) {
        const errorMessages = Object.values(validationErrors).flat().join(', ');
        toast.error(errorMessages);
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setSaving(false);
    }
  };

  const getRoleName = (role: string) => {
    const roleMap: Record<string, string> = {
      user: 'User',
      room_admin: 'Room Admin',
      GA: 'General Affairs',
    };
    return roleMap[role] || role;
  };

  if (loading) return <LoadingSpinner text="Loading user data..." />;
  if (error && !user) return <ErrorMessage message={error} />;
  if (!user) return <ErrorMessage message="User not found" />;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
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
          <h1 className="text-3xl font-bold text-white">Edit User</h1>
          <p className="text-slate-400 mt-1">Update user information and permissions</p>
        </div>
      </div>

      {/* User Info Card */}
      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-slate-400 flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  user.role === 'GA' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                  user.role === 'room_admin' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                  'bg-green-500/10 text-green-400 border border-green-500/20'
                }`}>
                  <Shield className="h-3 w-3" />
                  {getRoleName(user.role)}
                </span>
                {user.is_active ? (
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-sm flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Active
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-sm flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-800">
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5 text-blue-400" />
            User Information
          </CardTitle>
          <CardDescription className="text-slate-400">
            Update user profile and account settings
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300 font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-blue-400" />
                Full Name *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={saving}
                required
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400" />
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={saving}
                required
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
              />
            </div>

            {/* Division */}
            <div className="space-y-2">
              <Label htmlFor="division" className="text-slate-300 font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-400" />
                Division
              </Label>
              <Input
                id="division"
                name="division"
                value={formData.division}
                onChange={handleChange}
                disabled={saving}
                placeholder="e.g., IT, HR, Finance"
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label className="text-slate-300 font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                Role *
              </Label>
              <Select 
                value={formData.role} 
                onValueChange={(value: 'user' | 'room_admin' | 'GA') => 
                  setFormData({ ...formData, role: value })
                }
                disabled={saving}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                  <SelectItem value="user" className="text-slate-300 focus:bg-slate-800 focus:text-white">
                    User
                  </SelectItem>
                  <SelectItem value="room_admin" className="text-slate-300 focus:bg-slate-800 focus:text-white">
                    Room Admin
                  </SelectItem>
                  <SelectItem value="GA" className="text-slate-300 focus:bg-slate-800 focus:text-white">
                    General Affairs (GA)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                User: Regular user • Room Admin: Manage rooms & users • GA: Approve requests
              </p>
            </div>

            {/* Active Status */}
            <div className="space-y-2">
              <Label className="text-slate-300 font-medium">Account Status</Label>
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    {formData.is_active ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400" />
                    )}
                    <span className="text-slate-300 font-medium">
                      {formData.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {formData.is_active 
                      ? 'User can login and use the system' 
                      : 'User cannot login or access the system'}
                  </p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  disabled={saving}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={saving}
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
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
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-300">Important Notes</p>
              <ul className="text-sm text-blue-200/70 space-y-1 list-disc list-inside">
                <li>Changing the role will affect user permissions immediately</li>
                <li>Inactive users cannot login but their data is preserved</li>
                <li>Email must be unique across all users</li>
                <li>Users with upcoming bookings cannot be deleted</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
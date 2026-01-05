import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { usersApi } from '@/lib/apiService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Briefcase, 
  Shield, 
  Lock, 
  Bell,
  Save,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import type { UserPreference } from '@/lib/types';

export const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingPreferences, setLoadingPreferences] = useState(false);
  const [error, setError] = useState('');
  
  // Profile Form
  const [profileData, setProfileData] = useState({
    name: '',
    division: '',
  });

  // Password Form
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Preferences Form
  const [preferences, setPreferences] = useState<Partial<UserPreference>>({
    notification_24h: false,
    notification_3h: false,
    notification_30m: false,
    email_notifications: false,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        division: user.division || '',
      });
      if (user.preference) {
        setPreferences({
          notification_24h: user.preference.notification_24h,
          notification_3h: user.preference.notification_3h,
          notification_30m: user.preference.notification_30m,
          email_notifications: user.preference.email_notifications,
        });
      }
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const response = await usersApi.updateProfile(user.id_user, profileData);
      if (response.data.success && response.data.data) {
        updateUser(response.data.data);
        toast.success('Profile updated successfully!');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update profile';
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoadingPassword(true);
    try {
      const response = await usersApi.changePassword(
        passwordData.current_password,
        passwordData.new_password,
        passwordData.new_password_confirmation
      );
      if (response.data.success) {
        toast.success('Password changed successfully!');
        setPasswordData({
          current_password: '',
          new_password: '',
          new_password_confirmation: '',
        });
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to change password';
      toast.error(errorMsg);
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleUpdatePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoadingPreferences(true);
    try {
      const response = await usersApi.updatePreferences(preferences);
      if (response.data.success) {
        toast.success('Preferences updated successfully!');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update preferences';
      toast.error(errorMsg);
    } finally {
      setLoadingPreferences(false);
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

  if (!user) return <LoadingSpinner text="Loading profile..." />;
  if (error && !loading) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* User Info Card */}
      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-slate-400 flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-sm flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {getRoleName(user.role)}
                </span>
                {user.division && (
                  <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {user.division}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile */}
      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-800">
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5 text-blue-400" />
            Edit Profile
          </CardTitle>
          <CardDescription className="text-slate-400">
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300 font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-blue-400" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                disabled={loading}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="division" className="text-slate-300 font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-400" />
                Division
              </Label>
              <Input
                id="division"
                name="division"
                value={profileData.division}
                onChange={handleProfileChange}
                disabled={loading}
                placeholder="e.g., IT, HR, Finance"
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400" />
                Email Address
              </Label>
              <Input
                value={user.email}
                disabled
                className="bg-slate-800/30 border-slate-700 text-slate-500 h-11"
              />
              <p className="text-xs text-slate-500">Email cannot be changed</p>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            >
              {loading ? (
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
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-800">
          <CardTitle className="text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-blue-400" />
            Change Password
          </CardTitle>
          <CardDescription className="text-slate-400">
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_password" className="text-slate-300 font-medium">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="current_password"
                  name="current_password"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  disabled={loadingPassword}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password" className="text-slate-300 font-medium">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new_password"
                  name="new_password"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  disabled={loadingPassword}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-500">Minimum 8 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password_confirmation" className="text-slate-300 font-medium">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="new_password_confirmation"
                  name="new_password_confirmation"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.new_password_confirmation}
                  onChange={handlePasswordChange}
                  disabled={loadingPassword}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loadingPassword}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            >
              {loadingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-800">
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-400" />
            Notification Preferences
          </CardTitle>
          <CardDescription className="text-slate-400">
            Choose when you want to receive booking reminders
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleUpdatePreferences} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-slate-300 font-medium">24 Hours Before</Label>
                  <p className="text-sm text-slate-500">Get notified one day before your booking</p>
                </div>
                <Switch
                  checked={preferences.notification_24h}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, notification_24h: checked })}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-slate-300 font-medium">3 Hours Before</Label>
                  <p className="text-sm text-slate-500">Get notified 3 hours before your booking</p>
                </div>
                <Switch
                  checked={preferences.notification_3h}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, notification_3h: checked })}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-slate-300 font-medium">30 Minutes Before</Label>
                  <p className="text-sm text-slate-500">Get notified 30 minutes before your booking</p>
                </div>
                <Switch
                  checked={preferences.notification_30m}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, notification_30m: checked })}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <Separator className="bg-slate-700" />

              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-slate-300 font-medium">Email Notifications</Label>
                  <p className="text-sm text-slate-500">Receive notifications via email</p>
                </div>
                <Switch
                  checked={preferences.email_notifications}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, email_notifications: checked })}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loadingPreferences}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            >
              {loadingPreferences ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
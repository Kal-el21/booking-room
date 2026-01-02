import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, ArrowRight, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/lib/apiService';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    division: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
      setError('All fields except division are required');
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        division: formData.division || undefined
      });

      setSuccess(response.data.message || 'Registration successful! Redirecting to login...');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      const validationErrors = err.response?.data?.errors;
      
      if (validationErrors) {
        const errorMessages = Object.values(validationErrors).flat().join(', ');
        setError(errorMessages);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  return (
    <Card className="w-full max-w-md relative z-10 border-blue-800/50 bg-slate-900/80 backdrop-blur-sm shadow-2xl">
      <CardHeader className="space-y-3 text-center pb-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-blue-500/30">
          <User className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold text-white">Create Account</CardTitle>
        <CardDescription className="text-slate-400">
          Sign up to get started with our platform
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4" onKeyPress={handleKeyPress}>
          {error && (
            <Alert variant="destructive" className="border-red-500/50 bg-red-950/50">
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500/50 bg-green-950/50">
              <AlertDescription className="text-green-200">{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300 font-medium">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300 font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@company.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="division" className="text-slate-300 font-medium">Division (Optional)</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="division"
                name="division"
                type="text"
                placeholder="e.g. IT, HR, Finance"
                value={formData.division}
                onChange={handleChange}
                disabled={loading}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300 font-medium">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
              />
            </div>
            <p className="text-xs text-slate-500">Minimum 8 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation" className="text-slate-300 font-medium">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                placeholder="••••••••"
                value={formData.password_confirmation}
                onChange={handleChange}
                disabled={loading}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
              />
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all mt-6" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors inline-flex items-center gap-1"
            >
              Sign in
              <ArrowRight className="w-4 h-4" />
            </a>
          </p>
        </div>

        {/* Terms */}
        <p className="mt-4 text-xs text-center text-slate-500">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
        </p>
      </CardContent>
    </Card>
  );
};
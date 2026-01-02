import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
          <Lock className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
        <CardDescription className="text-slate-400">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-5" onKeyPress={handleKeyPress}>
          {error && (
            <Alert variant="destructive" className="border-red-500/50 bg-red-950/50">
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300 font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                id="email"
                type="email"
                placeholder="user@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Forgot password?
            </a>
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-2 text-slate-500">Test Accounts</span>
          </div>
        </div>

        {/* Test Accounts */}
        <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center text-slate-400">
              <span className="w-16 text-slate-500 font-medium">User:</span>
              <span className="text-slate-300">user@company.com / password123</span>
            </li>
            <li className="flex items-center text-slate-400">
              <span className="w-16 text-slate-500 font-medium">Admin:</span>
              <span className="text-slate-300">admin@company.com / password123</span>
            </li>
            <li className="flex items-center text-slate-400">
              <span className="w-16 text-slate-500 font-medium">GA:</span>
              <span className="text-slate-300">ga@company.com / password123</span>
            </li>
          </ul>
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            Don't have an account?{' '}
            <a 
              href="/register" 
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors inline-flex items-center gap-1"
            >
              Create an account
              <ArrowRight className="w-4 h-4" />
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
import { useState } from 'react';
import { Lock, User, Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAdminLogin } from '../hooks/useQueries';
import { setSessionToken } from '../hooks/useAuth';

interface AdminLoginProps {
  onNavigate: (path: string) => void;
}

export default function AdminLogin({ onNavigate }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const loginMutation = useAdminLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      const token = await loginMutation.mutateAsync({ username, password });
      setSessionToken(token);
      onNavigate('/admin/dashboard/tests');
    } catch {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-sky/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo + Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/assets/generated/logo.dim_256x256.png"
              alt="Success Test Series Hub"
              className="h-12 w-12 rounded-full object-cover border-2 border-gold/40"
            />
            <div>
              <div className="font-heading text-xl font-bold text-gold">Success Test Series</div>
              <div className="text-xs text-sky font-medium tracking-widest uppercase">Hub</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Shield size={14} className="text-gold" />
            <span>Admin Portal</span>
          </div>
        </div>

        <Card className="bg-card border-border shadow-navy">
          <CardHeader className="pb-4">
            <CardTitle className="font-heading text-2xl text-foreground text-center">
              Admin Login
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground/90 font-medium">
                  Username
                </Label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-9 bg-input border-border focus:border-gold focus:ring-gold/30"
                    autoComplete="username"
                    disabled={loginMutation.isPending}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground/90 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10 bg-input border-border focus:border-gold focus:ring-gold/30"
                    autoComplete="current-password"
                    disabled={loginMutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  <Shield size={14} />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gold text-navy-deep hover:bg-gold-light font-semibold h-11 text-base"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-navy-deep/30 border-t-navy-deep rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-border/50 text-center">
              <button
                onClick={() => onNavigate('/')}
                className="text-xs text-muted-foreground hover:text-gold transition-colors"
              >
                ← Back to main site
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

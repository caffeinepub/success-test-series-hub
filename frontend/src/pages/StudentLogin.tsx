import React, { useState } from 'react';
import { useStudentLogin, useStudentRegister } from '../hooks/useQueries';
import { setStudentToken, setStudentName } from '../hooks/useStudentAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, Phone, Lock, GraduationCap, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';

interface StudentLoginProps {
  onNavigate: (page: string) => void;
}

export default function StudentLogin({ onNavigate }: StudentLoginProps) {
  // Login state
  const [loginMobile, setLoginMobile] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register state
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  const loginMutation = useStudentLogin();
  const registerMutation = useStudentRegister();

  const validateMobile = (mobile: string): string | null => {
    if (!mobile.trim()) return 'Mobile number is required.';
    if (!/^\d{10}$/.test(mobile.trim())) return 'Please enter a valid 10-digit mobile number.';
    return null;
  };

  const handleLogin = async () => {
    setLoginError('');
    const mobileErr = validateMobile(loginMobile);
    if (mobileErr) { setLoginError(mobileErr); return; }
    if (!loginPassword.trim()) { setLoginError('Password is required.'); return; }

    try {
      const token = await loginMutation.mutateAsync({
        mobileNumber: loginMobile.trim(),
        password: loginPassword,
      });
      setStudentToken(token);
      setStudentName(loginMobile.trim());
      onNavigate('student-dashboard');
    } catch (err: any) {
      const msg: string = err?.message || '';
      if (msg.includes('Student not found') || msg.includes('Invalid password')) {
        setLoginError('Invalid mobile number or password. Please try again.');
      } else {
        setLoginError(msg || 'Login failed. Please try again.');
      }
    }
  };

  const handleRegister = async () => {
    setRegError('');
    setRegSuccess('');
    const mobileErr = validateMobile(regMobile);
    if (mobileErr) { setRegError(mobileErr); return; }
    if (!regPassword.trim()) { setRegError('Password is required.'); return; }
    if (regPassword.length < 6) { setRegError('Password must be at least 6 characters.'); return; }
    if (regPassword !== regConfirmPassword) { setRegError('Passwords do not match.'); return; }

    try {
      await registerMutation.mutateAsync({
        mobileNumber: regMobile.trim(),
        password: regPassword,
      });
      setRegSuccess('Registration successful! You can now login.');
      setRegMobile('');
      setRegPassword('');
      setRegConfirmPassword('');
    } catch (err: any) {
      const msg: string = err?.message || '';
      if (msg.includes('already registered')) {
        setRegError('This mobile number is already registered. Please login.');
      } else if (msg.includes('10 digits')) {
        setRegError('Mobile number must be exactly 10 digits.');
      } else {
        setRegError(msg || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/20 border border-gold-500/40 mb-4">
            <GraduationCap className="w-8 h-8 text-gold-400" />
          </div>
          <h1 className="text-2xl font-bold text-white font-rajdhani tracking-wide">
            Student Portal
          </h1>
          <p className="text-navy-300 mt-1 text-sm">
            Login or register with your mobile number
          </p>
        </div>

        {/* Card */}
        <div className="bg-navy-800 border border-navy-600 rounded-2xl p-8 shadow-navy">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full mb-6 bg-navy-700 border border-navy-600">
              <TabsTrigger
                value="login"
                className="flex-1 data-[state=active]:bg-gold-500 data-[state=active]:text-navy-950 text-navy-300"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="flex-1 data-[state=active]:bg-gold-500 data-[state=active]:text-navy-950 text-navy-300"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Register
              </TabsTrigger>
            </TabsList>

            {/* ── LOGIN TAB ── */}
            <TabsContent value="login">
              <div className="space-y-5">
                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-medium text-navy-200 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                    <Input
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={loginMobile}
                      onChange={(e) => setLoginMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      className="pl-10 bg-navy-700 border-navy-500 text-white placeholder:text-navy-400 focus:border-gold-500"
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-navy-200 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                    <Input
                      type={showLoginPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      className="pl-10 pr-10 bg-navy-700 border-navy-500 text-white placeholder:text-navy-400 focus:border-gold-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-gold-400 transition-colors"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
                    {loginError}
                  </p>
                )}

                <Button
                  onClick={handleLogin}
                  disabled={loginMutation.isPending}
                  className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold"
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* ── REGISTER TAB ── */}
            <TabsContent value="register">
              <div className="space-y-5">
                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-medium text-navy-200 mb-2">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                    <Input
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="pl-10 bg-navy-700 border-navy-500 text-white placeholder:text-navy-400 focus:border-gold-500"
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-navy-200 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                    <Input
                      type={showRegPassword ? 'text' : 'password'}
                      placeholder="Create a password (min. 6 characters)"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="pl-10 pr-10 bg-navy-700 border-navy-500 text-white placeholder:text-navy-400 focus:border-gold-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-gold-400 transition-colors"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-navy-200 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                    <Input
                      type={showRegConfirm ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                      className="pl-10 pr-10 bg-navy-700 border-navy-500 text-white placeholder:text-navy-400 focus:border-gold-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirm(!showRegConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-gold-400 transition-colors"
                    >
                      {showRegConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Inline password mismatch error */}
                  {regConfirmPassword && regPassword !== regConfirmPassword && (
                    <p className="text-red-400 text-xs mt-1">Passwords do not match.</p>
                  )}
                </div>

                {regError && (
                  <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
                    {regError}
                  </p>
                )}

                {regSuccess && (
                  <p className="text-green-400 text-sm bg-green-900/20 border border-green-800/40 rounded-lg px-3 py-2">
                    ✓ {regSuccess}
                  </p>
                )}

                <Button
                  onClick={handleRegister}
                  disabled={registerMutation.isPending}
                  className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold"
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-5 border-t border-navy-600 text-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-sm text-navy-400 hover:text-gold-400 transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useRequestOtp, useVerifyOtp } from '../hooks/useQueries';
import { setStudentToken, setStudentName } from '../hooks/useStudentAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Phone, KeyRound, GraduationCap } from 'lucide-react';

interface StudentLoginProps {
  onNavigate: (page: string) => void;
}

export default function StudentLogin({ onNavigate }: StudentLoginProps) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [otpDisplay, setOtpDisplay] = useState('');

  const requestOtpMutation = useRequestOtp();
  const verifyOtpMutation = useVerifyOtp();

  const handleSendOtp = async () => {
    setError('');
    if (!mobileNumber.trim() || mobileNumber.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    try {
      await requestOtpMutation.mutateAsync(mobileNumber.trim());
      setOtpSent(true);
      // Since OTP is simulated, show a hint (in production this would be sent via SMS)
      setOtpDisplay('OTP sent! (Check backend logs for the simulated OTP)');
    } catch (err: any) {
      setError(err?.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (!otp.trim() || otp.trim().length < 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    try {
      const [token, studentMobile] = await verifyOtpMutation.mutateAsync({
        mobileNumber: mobileNumber.trim(),
        otp: otp.trim(),
      });
      setStudentToken(token);
      setStudentName(studentMobile);
      onNavigate('student-dashboard');
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('Invalid OTP')) {
        setError('Invalid OTP. Please check and try again.');
      } else if (msg.includes('No OTP requested')) {
        setError('No OTP was requested. Please request a new OTP.');
      } else {
        setError(msg || 'Verification failed. Please try again.');
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
            Student Login
          </h1>
          <p className="text-navy-300 mt-1 text-sm">
            Login with your mobile number using OTP
          </p>
        </div>

        {/* Card */}
        <div className="bg-navy-800 border border-navy-600 rounded-2xl p-8 shadow-navy">
          {!otpSent ? (
            /* Step 1: Enter Mobile Number */
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-navy-200 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                  <Input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                    className="pl-10 bg-navy-700 border-navy-500 text-white placeholder:text-navy-400 focus:border-gold-500"
                    maxLength={10}
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <Button
                onClick={handleSendOtp}
                disabled={requestOtpMutation.isPending}
                className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold"
              >
                {requestOtpMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>
            </div>
          ) : (
            /* Step 2: Enter OTP */
            <div className="space-y-5">
              <div className="bg-navy-700/50 border border-navy-600 rounded-lg px-4 py-3 flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <div>
                  <p className="text-xs text-navy-400">OTP sent to</p>
                  <p className="text-white font-medium">{mobileNumber}</p>
                </div>
                <button
                  onClick={() => { setOtpSent(false); setOtp(''); setError(''); setOtpDisplay(''); }}
                  className="ml-auto text-xs text-gold-400 hover:text-gold-300 underline"
                >
                  Change
                </button>
              </div>

              {otpDisplay && (
                <p className="text-gold-400 text-xs bg-gold-500/10 border border-gold-500/30 rounded-lg px-3 py-2">
                  {otpDisplay}
                </p>
              )}

              <div>
                <label className="block text-sm font-medium text-navy-200 mb-2">
                  Enter OTP
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                    className="pl-10 bg-navy-700 border-navy-500 text-white placeholder:text-navy-400 focus:border-gold-500 tracking-widest text-center text-lg font-mono"
                    maxLength={6}
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <Button
                onClick={handleVerifyOtp}
                disabled={verifyOtpMutation.isPending}
                className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold"
              >
                {verifyOtpMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP & Login'
                )}
              </Button>

              <button
                onClick={handleSendOtp}
                disabled={requestOtpMutation.isPending}
                className="w-full text-sm text-navy-400 hover:text-gold-400 transition-colors"
              >
                {requestOtpMutation.isPending ? 'Resending...' : 'Resend OTP'}
              </button>
            </div>
          )}

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

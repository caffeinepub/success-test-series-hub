import React, { useEffect, useRef, useState } from 'react';
import { useStudentAuthToken, clearStudentToken } from '../hooks/useStudentAuth';
import { useGetStudentProfile, useUpdateStudentProfilePhoto, useStudentLogout } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Loader2, User, Upload, GraduationCap, BookOpen, Trophy, CreditCard, Phone, LogOut } from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (page: string) => void;
}

export default function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const { token, name } = useStudentAuthToken();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState('');

  const { data: profile, isLoading: profileLoading } = useGetStudentProfile(token || '');
  const updatePhotoMutation = useUpdateStudentProfilePhoto();
  const logoutMutation = useStudentLogout();

  useEffect(() => {
    if (!token) {
      onNavigate('student-login');
    }
  }, [token, onNavigate]);

  const handleLogout = async () => {
    if (token) {
      try {
        await logoutMutation.mutateAsync(token);
      } catch (_) {}
    }
    clearStudentToken();
    onNavigate('home');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file || !token) return;

    if (file.size > 500 * 1024) {
      setUploadError('Image must be smaller than 500KB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        await updatePhotoMutation.mutateAsync({ token, photoBase64: base64 });
      } catch (err: any) {
        setUploadError(err?.message || 'Failed to upload photo.');
      }
    };
    reader.readAsDataURL(file);
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Header */}
      <header className="bg-navy-900 border-b border-navy-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-gold-400" />
          <span className="text-white font-rajdhani font-bold text-lg">Student Dashboard</span>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="text-navy-300 hover:text-white hover:bg-navy-700"
        >
          {logoutMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </>
          )}
        </Button>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* My Profile Section */}
        <section className="bg-navy-800 border border-navy-600 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white font-rajdhani mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-gold-400" />
            My Profile
          </h2>

          {profileLoading ? (
            <div className="flex items-center gap-3 text-navy-300">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading profile...
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gold-500/50 bg-navy-700 flex items-center justify-center">
                  {profile?.profilePhotoBase64 ? (
                    <img
                      src={`data:image/jpeg;base64,${profile.profilePhotoBase64}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-navy-400" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gold-500 hover:bg-gold-400 flex items-center justify-center transition-colors"
                  title="Upload photo"
                >
                  {updatePhotoMutation.isPending ? (
                    <Loader2 className="w-4 h-4 text-navy-950 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 text-navy-950" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gold-400" />
                  <span className="text-navy-300 text-sm">Mobile Number</span>
                  <span className="text-white font-medium ml-1">
                    {profile?.mobileNumber || name || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-gold-400" />
                  <span className="text-navy-300 text-sm">Student ID</span>
                  <span className="text-white font-medium ml-1">
                    #{profile?.id?.toString() || 'N/A'}
                  </span>
                </div>
                {uploadError && (
                  <p className="text-red-400 text-sm">{uploadError}</p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={updatePhotoMutation.isPending}
                  className="border-gold-500/50 text-gold-400 hover:bg-gold-500/10 mt-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {profile?.profilePhotoBase64 ? 'Change Photo' : 'Upload Photo'}
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-bold text-white font-rajdhani mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="bg-navy-800 border border-navy-600 hover:border-gold-500/50 rounded-xl p-5 text-left transition-all group"
            >
              <BookOpen className="w-8 h-8 text-sky-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold">Free Tests</h3>
              <p className="text-navy-400 text-sm mt-1">Attempt free test series</p>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="bg-navy-800 border border-navy-600 hover:border-gold-500/50 rounded-xl p-5 text-left transition-all group"
            >
              <Trophy className="w-8 h-8 text-gold-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold">Top Rankers</h3>
              <p className="text-navy-400 text-sm mt-1">View leaderboard</p>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="bg-navy-800 border border-navy-600 hover:border-gold-500/50 rounded-xl p-5 text-left transition-all group"
            >
              <CreditCard className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold">Paid Tests</h3>
              <p className="text-navy-400 text-sm mt-1">Upgrade your plan</p>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

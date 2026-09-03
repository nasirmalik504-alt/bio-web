import React, { useState } from 'react';
import { verifyPassword, setSessionAuthenticated } from '../../utils/authStorage';
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardLockModalProps {
  onUnlock: () => void;
}

export const DashboardLockModal: React.FC<DashboardLockModalProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Please enter the dashboard password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (verifyPassword(password.trim())) {
        setSessionAuthenticated(true, remember);
        onUnlock();
      } else {
        setError('Incorrect password.');
        setIsSubmitting(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#1A263B] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Background Decorative Blur Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#6EA8FE]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#7CC9A5]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 relative z-10 space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-[#F4F8FC] border border-[#E6ECF5] text-[#23324D] rounded-2xl mx-auto flex items-center justify-center shadow-xs">
            <Lock className="w-8 h-8 text-[#6EA8FE]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#23324D] tracking-tight font-display">
              Admin Portal Restricted Access
            </h2>
            <p className="text-xs text-[#5F708A] mt-1">
              Enter your password to unlock the Biobusiness Dashboard & Invoice Maker.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-[#FCECEF] border border-[#F8B4BF] text-[#C42828] rounded-xl text-xs font-semibold flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#23324D] mb-1 flex items-center justify-between">
              <span>Dashboard Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-9 pr-10 py-2.5 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none bg-[#FDFEFF]"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-[#5F708A]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded text-[#6EA8FE] focus:ring-[#6EA8FE] cursor-pointer"
              />
              <span>Remember on this browser</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#23324D] hover:bg-[#1A263B] text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-[#6EA8FE]" />
            {isSubmitting ? 'Verifying...' : 'Unlock Portal'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="border-t border-[#E6ECF5] pt-4 text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs text-[#5F708A] hover:text-[#23324D] font-bold flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Website
          </button>
        </div>

      </div>
    </div>
  );
};

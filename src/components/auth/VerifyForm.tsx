import { useState, useEffect } from 'react';
import { Shield, ArrowLeft, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMernAccess } from 'mern-access-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatCountdown } from '../../utils/timeFormat';

const apiURL = import.meta.env.VITE_AUTHAPI_URL || '';

export const VerifyForm = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(0);
  const navigate = useNavigate();
  const { verify } = useMernAccess();

  // Start countdown timer for resend timeout
  useEffect(() => {
    if (resendTimeout <= 0) return;

    const timer = setInterval(() => {
      setResendTimeout(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimeout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setLoading(true);
    
    const userId = localStorage.getItem('userId') || '';
    const res = await verify(userId, otp);

    if (!res.success) {
      // Handle error - you might want to show a toast
      console.error('Verification failed:', res.error);
      setLoading(false);
      return;
    }

    // Success - mern-access should handle the token storage
    // Redirect based on role
    if (res.data?.user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (res.data?.user?.role === 'federation') {
      navigate('/federation/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleResend = async () => {
    if (resendTimeout > 0) return;
    
    const userId = localStorage.getItem('userId') || '';
    const res = await verify(userId);
    if (res.success) {
      toast.success('OTP resent successfully');
      setResendTimeout(120); // Start 2-minute countdown
    } else {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 border-2 border-[var(--border)] hover:bg-[var(--bg-secondary)]"
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Shield className="w-6 h-6" />
          <h2>VERIFY IDENTITY</h2>
        </div>

        {/* Simulation notice with orange styling and info icon */}
        <div className="flex gap-3 p-4 mb-6 border-2 border-dotted border-orange-500/50 dark:border-orange-400/50 bg-orange-50/50 dark:bg-orange-950/20 rounded-lg">
          <Info className="w-5 h-5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
          <div>
            <p className="text-sm text-orange-800 dark:text-orange-200 font-medium mb-1">Simulation Mode</p>
            <p className="text-sm text-orange-700/90 dark:text-orange-300/90">
              Get your OTP at: <code className="px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/50 rounded font-mono">{`${apiURL}/otpsim`}</code>
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-[var(--text-secondary)] text-sm uppercase tracking-wide">
            ENTER 6-DIGIT CODE SENT TO YOUR EMAIL
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
              }}
              placeholder="000000"
              className="input text-center text-xl font-mono tracking-widest"
              maxLength={6}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="btn btn-primary w-full mb-4"
          >
            {loading ? 'VERIFYING...' : 'VERIFY CODE'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={handleResend}
            className="text-sm uppercase tracking-wide hover:underline disabled:opacity-50 disabled:no-underline"
            disabled={loading || resendTimeout > 0}
          >
            {resendTimeout > 0 ? `RESEND CODE (${formatCountdown(resendTimeout)})` : 'RESEND CODE'}
          </button>
        </div>
      </div>
    </div>
  );
};
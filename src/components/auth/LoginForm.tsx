import { useState } from 'react';
import { useMernAccess } from 'mern-access-client';
import { LogIn } from 'lucide-react';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

export const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
  const { login, verify } = useMernAccess();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    let res = await login(email, password);

    if (res.success) {
      // Redirect based on role
      if (res.data.user.role === 'admin') {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/federation/dashboard";
      }
      toast.success("Login successful!");
      setLoading(false);
    } else if (res.error.includes("not verified")) {
      toast.info(res.error || "Login failed");
      localStorage.setItem("userId", email);
      const _res = await verify(email, undefined);
      if (_res.success) {
        toast.success("OTP sent! Please check your email.");
        window.location.href = "/verify";
      } else {
        toast.error(_res.error || "Failed to send OTP");
      }
    } else {
      toast.error(res.error || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="card max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <LogIn className="w-8 h-8" />
        <h2>LOGIN</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="border-2 border-red-600 bg-red-50 dark:bg-red-950 p-4">
            <p className="text-red-600 dark:text-red-400 font-bold">{error}</p>
          </div>
        )}

        <div>
          <label className="block mb-2 font-bold uppercase text-sm tracking-wider">
            EMAIL
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-bold uppercase text-sm tracking-wider">
            PASSWORD
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'LOGGING IN...' : 'LOGIN'}
        </button>

        {onSwitchToSignup && (
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="btn w-full"
          >
            CREATE ACCOUNT
          </button>
        )}
      </form>
    </div>
  );
};

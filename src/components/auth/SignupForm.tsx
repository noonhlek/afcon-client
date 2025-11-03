import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { UserRole } from '../../types/auth';
import { useMernAccess } from 'mern-access-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const AFRICAN_COUNTRIES = [
  'Nigeria', 'Ghana', 'Senegal', 'Egypt', 'Morocco', 'Cameroon',
  'Algeria', 'Tunisia', 'Ivory Coast', 'Mali', 'Burkina Faso',
  'South Africa', 'Kenya', 'Tanzania', 'Uganda', 'Ethiopia'
];

export const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('federation');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useMernAccess();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const signupData: Record<string, any> = {
      email,
      password,
      username,
      country,
      role
    };

    setLoading(true);
    const res = await signup(signupData);
    if (res.success) {
      localStorage.setItem("userId", signupData.username);
      toast.success("Signup successful! Please check your email for the OTP.");
      window.location.href = "/verify";
    } else {
      toast.error(res.error || "Signup failed");
    }
    setLoading(false);
  };

  return (
    <div className="card max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="w-8 h-8" />
        <h2>SIGNUP</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="border-2 border-red-600 bg-red-50 dark:bg-red-950 p-4">
            <p className="text-red-600 dark:text-red-400 font-bold">{error}</p>
          </div>
        )}

        <div>
          <label className="block mb-2 font-bold uppercase text-sm tracking-wider">
            ACCOUNT TYPE
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="input"
          >
            <option value="federation">FEDERATION REPRESENTATIVE</option>
            <option value="admin">ADMINISTRATOR</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-bold uppercase text-sm tracking-wider">
            USERNAME
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            required
          />
        </div>

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
            minLength={6}
          />
        </div>

        {role === 'federation' && (
          <div>
            <label className="block mb-2 font-bold uppercase text-sm tracking-wider">
              COUNTRY
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="input"
              required
            >
              <option value="">SELECT COUNTRY</option>
              {AFRICAN_COUNTRIES.map((c) => (
                <option key={c} value={c}>{c.toUpperCase()}</option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
        </button>

        {onSwitchToLogin && (
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="btn w-full"
          >
            BACK TO LOGIN
          </button>
        )}
      </form>
    </div>
  );
};

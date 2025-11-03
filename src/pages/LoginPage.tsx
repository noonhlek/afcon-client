import { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { useEffect } from 'react';
import { useMernAccess } from 'mern-access-client';

export const LoginPage = () => {
  const [showSignup, setShowSignup] = useState(false);
  const { user } = useMernAccess();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else if (user.role === 'federation') {
        window.location.href = '/federation/dashboard';
      } else {
        window.location.href = '/';
      }
    }
  }, [user]);

  const handleSuccess = () => {
    if (user?.role === 'admin') {
      window.location.href = '/admin/dashboard';
    } else if (user?.role === 'federation') {
      window.location.href = '/federation/dashboard';
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {showSignup ? (
        <SignupForm
          onSuccess={handleSuccess}
          onSwitchToLogin={() => setShowSignup(false)}
        />
      ) : (
        <LoginForm
          onSuccess={handleSuccess}
          onSwitchToSignup={() => setShowSignup(true)}
        />
      )}
    </div>
  );
};

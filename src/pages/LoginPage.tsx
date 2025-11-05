import { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';

export const LoginPage = () => {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {showSignup ? (
        <SignupForm
          onSwitchToLogin={() => setShowSignup(false)}
        />
      ) : (
        <LoginForm
          onSwitchToSignup={() => setShowSignup(true)}
        />
      )}
    </div>
  );
};

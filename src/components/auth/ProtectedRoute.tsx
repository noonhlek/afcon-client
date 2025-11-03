import { ReactNode } from 'react';
import { UserRole } from '../../types/auth';
import { ShieldAlert } from 'lucide-react';
import { useMernAccess } from 'mern-access-client';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  requireAuth = true
}: ProtectedRouteProps) => {
  const { user, isLoading } = useMernAccess();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <p className="font-bold uppercase tracking-wider">LOADING...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md text-center">
          <ShieldAlert className="w-16 h-16 mx-auto mb-4" />
          <h2 className="mb-4">ACCESS DENIED</h2>
          <p className="mb-6">YOU MUST BE LOGGED IN TO VIEW THIS PAGE</p>
          <a href="/auth" className="btn btn-primary">
            GO TO LOGIN
          </a>
        </div>
      </div>
    );
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md text-center">
          <ShieldAlert className="w-16 h-16 mx-auto mb-4" />
          <h2 className="mb-4">INSUFFICIENT PERMISSIONS</h2>
          <p className="mb-6">
            ROLE REQUIRED: {requiredRole?.toUpperCase()}
            <br />
            YOUR ROLE: {user?.role?.toUpperCase()}
          </p>
          <a href="/" className="btn btn-primary">
            GO HOME
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

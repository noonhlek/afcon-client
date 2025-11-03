import { ReactNode } from 'react';
import { UserRole } from '../../types/auth';
import { useMernAccess } from 'mern-access-client';

interface RoleRestrictedProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export const RoleRestricted = ({
  children,
  fallback = null
}: RoleRestrictedProps) => {
  const { user } = useMernAccess();

  if (!user) return <>{fallback}</>;

  if (user.role === 'admin') {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

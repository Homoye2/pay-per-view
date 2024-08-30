// components/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'components/AuthContext';
import paths from 'routes/paths';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[]; // Rôles autorisés
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, userRole } = useAuth();
  console.log("User Role:", userRole);
  console.log("User Role:", isAuthenticated);

  if (!isAuthenticated) {

    return <Navigate to="/" replace />;
  }
  if (roles && !roles.includes(userRole)) {
    return <Navigate to={paths.unauthorized} replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;

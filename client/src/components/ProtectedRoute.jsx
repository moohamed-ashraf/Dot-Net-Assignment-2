import { Navigate } from 'react-router-dom';
import { getToken, loadUser } from '../services/api.js';

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = loadUser();
  const isLoggedIn = Boolean(getToken() && user);
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  if (Array.isArray(allowedRoles) && !allowedRoles.includes(user.role)) {
    return <Navigate to="/courses" replace />;
  }

  return children;
}

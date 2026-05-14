import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearSession, loadUser } from '../services/api.js';
import { canAccessEnrollmentsPage, canManageCourses } from '../services/permissions.js';
import { useTheme } from './ThemeContext.jsx';

export default function Navbar() {
  const user = loadUser();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = Boolean(user);
  const { theme, toggleTheme } = useTheme();

  function logout() {
    clearSession();
    navigate('/login');
  }

  function isActive(path) {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }

  function initials(name) {
    if (!name) return '?';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">CF</div>
          <span className="brand-text">CourseForge</span>
        </Link>

        <div className="navbar-links">
          {!isLoggedIn && (
            <>
              <Link to="/login" style={isActive('/login') ? { color: 'var(--accent)', background: 'var(--accent-light)' } : {}}>
                Sign In
              </Link>
              <Link to="/register" style={isActive('/register') ? { color: 'var(--accent)', background: 'var(--accent-light)' } : {}}>
                Register
              </Link>
            </>
          )}
          {isLoggedIn && (
            <>
              {user.role === 'Admin' && (
                <Link to="/dashboard" style={isActive('/dashboard') ? { color: 'var(--accent)', background: 'var(--accent-light)' } : {}}>
                  Dashboard
                </Link>
              )}
              <Link to="/courses" style={isActive('/courses') ? { color: 'var(--accent)', background: 'var(--accent-light)' } : {}}>
                Courses
              </Link>
              {canManageCourses(user.role) && (
                <Link
                  to="/courses/new"
                  style={isActive('/courses/new') ? { color: 'var(--accent)', background: 'var(--accent-light)' } : {}}
                >
                  Add Course
                </Link>
              )}
              {canAccessEnrollmentsPage(user.role) && (
                <Link
                  to="/enrollments"
                  style={isActive('/enrollments') ? { color: 'var(--accent)', background: 'var(--accent-light)' } : {}}
                >
                  Enrollments
                </Link>
              )}
            </>
          )}
        </div>

        <div className="navbar-right">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '\u2600' : '\u263E'}
          </button>

          {isLoggedIn && (
            <div className="navbar-user">
              <div className="user-avatar">{initials(user.name)}</div>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
              <button type="button" className="btn-logout" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

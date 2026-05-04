import { Link, useNavigate } from 'react-router-dom';
import { clearSession, loadUser } from '../services/api.js';

export default function Navbar() {
  const user = loadUser();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(user);

  function logout() {
    clearSession();
    navigate('/login');
  }

  return (
    <nav className="nav card">
      <div className="nav-links">
        <Link to="/">Home</Link>
        {!isLoggedIn && <Link to="/login">Login</Link>}
        {!isLoggedIn && <Link to="/register">Register</Link>}
        {isLoggedIn && <Link to="/courses">Courses</Link>}
        {isLoggedIn && <Link to="/courses/new">Add Course</Link>}
        {isLoggedIn && <Link to="/enrollments">Enrollments</Link>}
      </div>

      {isLoggedIn && (
        <div className="nav-user">
          <span>{user.name} ({user.role})</span>
          <button type="button" className="secondary" onClick={logout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

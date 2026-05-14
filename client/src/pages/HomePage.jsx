import { Link } from 'react-router-dom';
import { loadUser } from '../services/api.js';

export default function HomePage() {
  const user = loadUser();
  const isLoggedIn = Boolean(user);

  return (
    <>
      <div className="page-header">
        <h1>{isLoggedIn ? `Welcome back, ${user.name}` : 'Welcome to CourseForge'}</h1>
        <p>
          {isLoggedIn
            ? 'Manage your courses, assignments, and enrollments from one place.'
            : 'A modern platform for managing courses, assignments, and enrollments.'}
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">&#128218;</div>
          <div className="stat-label">Courses</div>
          <div className="stat-value">Browse &amp; manage course catalog</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">&#128221;</div>
          <div className="stat-label">Assignments</div>
          <div className="stat-value">Create, submit &amp; grade work</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">&#128101;</div>
          <div className="stat-label">Enrollments</div>
          <div className="stat-value">Manage student enrollments</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">&#128274;</div>
          <div className="stat-label">Role-Based</div>
          <div className="stat-value">Admin, Instructor &amp; Student</div>
        </div>
      </div>

      <section className="card">
        <h2>How It Works</h2>
        <ul>
          <li><strong>Students</strong> can browse courses, enroll, submit assignments, and view grades.</li>
          <li><strong>Instructors</strong> can create courses and assignments, view submissions, and grade student work.</li>
          <li><strong>Admins</strong> have full control over all courses, enrollments, and assignments.</li>
        </ul>
        {!isLoggedIn && (
          <div className="btn-row" style={{ marginTop: '1.25rem' }}>
            <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>Sign In</Link>
            <Link to="/register" className="btn-secondary" style={{ textDecoration: 'none' }}>Create Account</Link>
          </div>
        )}
        {isLoggedIn && (
          <div className="btn-row" style={{ marginTop: '1.25rem' }}>
            {user.role === 'Admin' && (
              <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>Admin Dashboard</Link>
            )}
            <Link to="/courses" className={user.role === 'Admin' ? 'btn-secondary' : 'btn-primary'} style={{ textDecoration: 'none' }}>View Courses</Link>
            <Link to="/enrollments" className="btn-secondary" style={{ textDecoration: 'none' }}>Enrollments</Link>
          </div>
        )}
      </section>
    </>
  );
}

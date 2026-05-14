import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  fetchCourses,
  fetchEnrollments,
  fetchUsers,
  loadUser,
} from '../services/api.js';

export default function AdminDashboardPage() {
  const user = loadUser();
  if (user?.role !== 'Admin') return <Navigate to="/courses" replace />;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  async function loadAll() {
    setError('');
    setLoading(true);
    try {
      const [usersData, coursesData, enrollmentsData] = await Promise.all([
        fetchUsers(),
        fetchCourses(),
        fetchEnrollments(),
      ]);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  const admins = users.filter((u) => u.role === 'Admin');
  const instructors = users.filter((u) => u.role === 'Instructor');
  const students = users.filter((u) => u.role === 'Student');

  const enrollmentsByCourse = {};
  enrollments.forEach((e) => {
    enrollmentsByCourse[e.courseId] = (enrollmentsByCourse[e.courseId] || 0) + 1;
  });

  return (
    <>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Platform overview and management</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading && (
        <div className="loading-spinner"><div className="spinner" /></div>
      )}

      {!loading && (
        <>
          {/* ── Stats overview ── */}
          <div className="dashboard-stats">
            <div className="dash-stat">
              <div className="dash-stat-number">{users.length}</div>
              <div className="dash-stat-label">Total Users</div>
              <div className="dash-stat-breakdown">
                <span className="badge badge-primary">{admins.length} Admin{admins.length !== 1 && 's'}</span>
                <span className="badge badge-success">{instructors.length} Instructor{instructors.length !== 1 && 's'}</span>
                <span className="badge badge-warning">{students.length} Student{students.length !== 1 && 's'}</span>
              </div>
            </div>
            <div className="dash-stat">
              <div className="dash-stat-number">{courses.length}</div>
              <div className="dash-stat-label">Courses</div>
              <div className="dash-stat-sub">
                <Link to="/courses">Manage courses</Link>
              </div>
            </div>
            <div className="dash-stat">
              <div className="dash-stat-number">{enrollments.length}</div>
              <div className="dash-stat-label">Enrollments</div>
              <div className="dash-stat-sub">
                <Link to="/enrollments">Manage enrollments</Link>
              </div>
            </div>
          </div>

          {/* ── Quick actions ── */}
          <section className="card">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <Link to="/courses/new" className="quick-action-btn">
                <span className="qa-icon">+</span>
                <span>New Course</span>
              </Link>
              <Link to="/enrollments" className="quick-action-btn">
                <span className="qa-icon">&#128101;</span>
                <span>Enrollments</span>
              </Link>
              <Link to="/courses" className="quick-action-btn">
                <span className="qa-icon">&#128218;</span>
                <span>All Courses</span>
              </Link>
              <Link to="/register" className="quick-action-btn">
                <span className="qa-icon">&#128100;</span>
                <span>Register User</span>
              </Link>
            </div>
          </section>

          {/* ── Users table ── */}
          <section className="card">
            <div className="card-header">
              <h2>All Users</h2>
              <span className="badge badge-primary">{users.length} total</span>
            </div>

            {users.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">&#128100;</div>
                <h3>No users found</h3>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td><span className="badge badge-primary">#{u.id}</span></td>
                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                        <td>
                          <span className={`badge ${
                            u.role === 'Admin' ? 'badge-danger' :
                            u.role === 'Instructor' ? 'badge-success' :
                            'badge-warning'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── Courses overview ── */}
          <section className="card">
            <div className="card-header">
              <h2>Courses Overview</h2>
              <Link to="/courses/new" className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem', textDecoration: 'none' }}>
                + New Course
              </Link>
            </div>

            {courses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">&#128218;</div>
                <h3>No courses yet</h3>
                <p>Create your first course to get started.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Instructor</th>
                      <th>Enrollments</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c) => (
                      <tr key={c.id}>
                        <td><span className="badge badge-primary">#{c.id}</span></td>
                        <td style={{ fontWeight: 600 }}>{c.title}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{c.instructorName}</td>
                        <td>
                          <span className="badge badge-warning">
                            {enrollmentsByCourse[c.id] || 0} enrolled
                          </span>
                        </td>
                        <td>
                          <div className="actions">
                            <Link to={`/courses/${c.id}`} className="small-link">Edit</Link>
                            <Link to={`/courses/${c.id}/assignments`} className="small-link">Assignments</Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── Enrollments breakdown ── */}
          <section className="card">
            <div className="card-header">
              <h2>Recent Enrollments</h2>
              <Link to="/enrollments" className="btn-sm" style={{ textDecoration: 'none' }}>View All</Link>
            </div>

            {enrollments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">&#128101;</div>
                <h3>No enrollments yet</h3>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Course</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.slice(0, 10).map((e) => (
                      <tr key={`${e.userId}-${e.courseId}`}>
                        <td>
                          <span className="badge badge-primary" style={{ marginRight: '0.5rem' }}>#{e.userId}</span>
                          {e.userName}
                        </td>
                        <td>{e.courseTitle}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {enrollments.length > 10 && (
              <p className="hint" style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                Showing 10 of {enrollments.length} enrollments.{' '}
                <Link to="/enrollments">See all</Link>
              </p>
            )}
          </section>
        </>
      )}
    </>
  );
}

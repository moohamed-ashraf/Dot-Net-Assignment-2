import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteCourse, fetchCourses, fetchMyEnrollments, loadUser } from '../services/api.js';
import { canManageCourses } from '../services/permissions.js';

export default function CoursesPage() {
  const navigate = useNavigate();
  const user = loadUser();
  const isStudent = user?.role === 'Student';
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadCourses() {
    setError('');
    setLoading(true);
    try {
      const data = await fetchCourses();
      setCourses(Array.isArray(data) ? data : []);

      if (isStudent) {
        const mine = await fetchMyEnrollments();
        const ids = new Set((Array.isArray(mine) ? mine : []).map((e) => e.courseId));
        setEnrolledIds(ids);
      }
    } catch (err) {
      setError(err.message || 'Failed to load courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm(`Delete course #${id}?`)) return;
    try {
      await deleteCourse(id);
      await loadCourses();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Courses</h1>
        <p>{isStudent ? 'Browse available courses' : 'Browse and manage available courses'}</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <section className="card">
        <div className="card-header">
          <h2>All Courses</h2>
          <div className="btn-row">
            <button type="button" className="btn-sm" onClick={loadCourses} disabled={loading}>
              Refresh
            </button>
            {canManageCourses(user?.role) && (
              <button type="button" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }} onClick={() => navigate('/courses/new')}>
                + New Course
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="loading-spinner"><div className="spinner" /></div>
        )}

        {!loading && courses.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">&#128218;</div>
            <h3>No courses found</h3>
            <p>Get started by creating your first course.</p>
          </div>
        )}

        {!loading && courses.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Instructor</th>
                  {isStudent && <th>Status</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => {
                  const enrolled = enrolledIds.has(course.id);
                  return (
                    <tr key={course.id}>
                      <td><span className="badge badge-primary">#{course.id}</span></td>
                      <td style={{ fontWeight: 600 }}>{course.title}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{course.instructorName}</td>
                      {isStudent && (
                        <td>
                          {enrolled
                            ? <span className="badge badge-success">Enrolled</span>
                            : <span className="badge badge-warning">Not enrolled</span>}
                        </td>
                      )}
                      <td>
                        <div className="actions">
                          {!isStudent && (
                            <Link to={`/courses/${course.id}`} className="small-link">
                              {canManageCourses(user?.role) ? 'Edit' : 'View'}
                            </Link>
                          )}
                          {isStudent && enrolled && (
                            <Link to={`/courses/${course.id}/assignments`} className="small-link">
                              Assignments
                            </Link>
                          )}
                          {!isStudent && (
                            <Link to={`/courses/${course.id}/assignments`} className="small-link">
                              Assignments
                            </Link>
                          )}
                          {canManageCourses(user?.role) && (
                            <button type="button" className="small danger" onClick={() => handleDelete(course.id)}>
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

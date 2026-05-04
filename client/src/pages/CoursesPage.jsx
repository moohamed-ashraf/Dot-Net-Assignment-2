import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteCourse, fetchCourses, loadUser } from '../services/api.js';

function canManageCourses(role) {
  return role === 'Admin' || role === 'Instructor';
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const user = loadUser();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadCourses() {
    setError('');
    setLoading(true);
    try {
      const data = await fetchCourses();
      setCourses(Array.isArray(data) ? data : []);
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
    <section className="card">
      <div className="row-heading">
        <h2>Courses (GET /api/Courses)</h2>
        <button type="button" className="small" onClick={loadCourses} disabled={loading}>Refresh</button>
      </div>

      {loading && <p className="hint">Loading courses...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && courses.length === 0 && <p className="hint">No courses found.</p>}

      {courses.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Instructor</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.id}</td>
                  <td>{course.title}</td>
                  <td>{course.instructorName}</td>
                  <td className="actions">
                    <Link to={`/courses/${course.id}`} className="small-link">View/Edit</Link>
                    {canManageCourses(user?.role) && (
                      <button type="button" className="small danger" onClick={() => handleDelete(course.id)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {canManageCourses(user?.role) && (
        <div className="btn-row">
          <button type="button" onClick={() => navigate('/courses/new')}>Create New Course</button>
        </div>
      )}
    </section>
  );
}

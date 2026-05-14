import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { createCourse, fetchUsers, loadUser } from '../services/api.js';
import { canManageCourses } from '../services/permissions.js';

export default function CourseFormPage() {
  const navigate = useNavigate();
  const user = loadUser();

  if (!canManageCourses(user?.role)) {
    return <Navigate to="/courses" replace />;
  }

  const uid = Number(user?.userId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructorId, setInstructorId] = useState('2');
  const [instructors, setInstructors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadInstructors() {
      if (user?.role !== 'Admin') return;
      try {
        const list = await fetchUsers('Instructor');
        setInstructors(Array.isArray(list) ? list : []);
        if (Array.isArray(list) && list.length > 0) {
          setInstructorId(String(list[0].id));
        }
      } catch {
        setInstructors([]);
      }
    }
    loadInstructors();
  }, [user?.role]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const resolvedInstructorId = user.role === 'Instructor' ? uid : parseInt(instructorId, 10);
      await createCourse({
        title: title.trim(),
        description: description.trim(),
        instructorId: resolvedInstructorId,
      });
      setTitle('');
      setDescription('');
      if (user?.role === 'Admin') {
        setInstructorId(instructors[0] ? String(instructors[0].id) : '');
      }
      navigate('/courses');
    } catch (err) {
      setError(err.message || 'Course creation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Create Course</h1>
        <p>Add a new course to the catalog</p>
      </div>

      <section className="card" style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Introduction to CS" required />
          </label>
          <label>
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Course description..." required />
          </label>

          {user?.role === 'Admin' && (
            <label>
              Instructor
              <select value={instructorId} onChange={(e) => setInstructorId(e.target.value)} required>
                {instructors.map((ins) => (
                  <option key={ins.id} value={ins.id}>
                    #{ins.id} - {ins.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          {user?.role === 'Instructor' && (
            <div className="alert alert-warning">You are creating this course as instructor #{uid}.</div>
          )}

          {error && <div className="alert alert-error">{error}</div>}
          <div className="btn-row">
            <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create Course'}</button>
            <button type="button" className="secondary" onClick={() => navigate('/courses')}>Cancel</button>
          </div>
        </form>
      </section>
    </>
  );
}

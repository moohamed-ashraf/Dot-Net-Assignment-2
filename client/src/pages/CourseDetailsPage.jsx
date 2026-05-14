import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchCourse, fetchUsers, loadUser, updateCourse } from '../services/api.js';
import { canManageCourses } from '../services/permissions.js';

export default function CourseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = loadUser();
  const [course, setCourse] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadCourse() {
      setError('');
      setLoading(true);
      try {
        const data = await fetchCourse(id);
        setCourse(data);
        setTitle(data.title);
        setDescription(data.description);
        setInstructorId(String(data.instructorId));
      } catch (err) {
        setError(err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [id]);

  useEffect(() => {
    async function loadInstructors() {
      try {
        const list = await fetchUsers('Instructor');
        setInstructors(Array.isArray(list) ? list : []);
      } catch {
        setInstructors([]);
      }
    }
    if (canManageCourses(user?.role)) loadInstructors();
  }, [user?.role]);

  async function handleUpdate(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await updateCourse(id, {
        title: title.trim(),
        description: description.trim(),
        instructorId: parseInt(instructorId, 10),
      });
      const data = await fetchCourse(id);
      setCourse(data);
      setTitle(data.title);
      setDescription(data.description);
      setInstructorId(String(data.instructorId));
      setSuccess('Course updated successfully.');
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Course Details</h1>
        <p>View and manage course information</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading && (
        <div className="loading-spinner"><div className="spinner" /></div>
      )}

      {course && (
        <section className="card">
          <div className="card-header">
            <h2>{course.title}</h2>
            <div className="btn-row">
              <Link to={`/courses/${id}/assignments`} className="btn-sm" style={{ textDecoration: 'none' }}>
                Assignments
              </Link>
              <button type="button" className="btn-sm" onClick={() => navigate('/courses')}>
                Back
              </button>
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{course.description}</p>
          <p className="hint">
            Instructor: <strong style={{ color: 'var(--text)' }}>{course.instructorName}</strong>
          </p>

          {canManageCourses(user?.role) && (
            <>
              <hr className="divider" />
              <h3>Update Course</h3>
              <form onSubmit={handleUpdate} className="form compact">
                <label>
                  Title
                  <input value={title} onChange={(e) => setTitle(e.target.value)} required />
                </label>
                <label>
                  Description
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
                </label>
                <label>
                  Instructor
                  {instructors.length > 0 ? (
                    <select value={instructorId} onChange={(e) => setInstructorId(e.target.value)} required>
                      {instructors.map((ins) => (
                        <option key={ins.id} value={ins.id}>
                          #{ins.id} - {ins.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input type="number" min={1} value={instructorId} onChange={(e) => setInstructorId(e.target.value)} required />
                  )}
                </label>
                {success && <div className="alert alert-success">{success}</div>}
                <div className="btn-row">
                  <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                  <button type="button" className="secondary" onClick={() => navigate('/courses')}>Cancel</button>
                </div>
              </form>
            </>
          )}
        </section>
      )}
    </>
  );
}

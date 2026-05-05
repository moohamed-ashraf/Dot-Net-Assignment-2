import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    <section className="card">
      <h2>Course Details (GET /api/Courses/{id})</h2>
      {loading && <p className="hint">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {course && (
        <>
          <p><strong>Current title:</strong> {course.title}</p>
          <p className="desc">{course.description}</p>
          <p className="hint">Instructor: {course.instructorName} (#{course.instructorId})</p>

          {canManageCourses(user?.role) && (
            <form onSubmit={handleUpdate} className="form compact">
              <h3>Update Course (PUT /api/Courses/{id})</h3>
              <label>
                Title
                <input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </label>
              <label>
                Description
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
              </label>
              <label>
                Instructor Id
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
              {success && <p className="success">{success}</p>}
              <div className="btn-row">
                <button type="submit" disabled={saving}>{saving ? 'Updating...' : 'Update'}</button>
                <button type="button" className="secondary" onClick={() => navigate('/courses')}>Back</button>
              </div>
            </form>
          )}
        </>
      )}
    </section>
  );
}

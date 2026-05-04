import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse, loadUser } from '../services/api.js';

export default function CourseFormPage() {
  const navigate = useNavigate();
  const user = loadUser();
  const uid = Number(user?.userId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructorId, setInstructorId] = useState('2');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      if (user?.role === 'Admin') setInstructorId('2');
      navigate('/courses');
    } catch (err) {
      setError(err.message || 'Course creation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>Create Course (POST /api/Courses)</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
        </label>

        {user?.role === 'Admin' && (
          <label>
            Instructor Id
            <input type="number" min={1} value={instructorId} onChange={(e) => setInstructorId(e.target.value)} required />
          </label>
        )}
        {user?.role === 'Instructor' && (
          <p className="hint">You are creating this course as instructor user #{uid}.</p>
        )}

        {error && <p className="error">{error}</p>}
        <div className="btn-row">
          <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Course'}</button>
          <button type="button" className="secondary" onClick={() => navigate('/courses')}>Cancel</button>
        </div>
      </form>
    </section>
  );
}

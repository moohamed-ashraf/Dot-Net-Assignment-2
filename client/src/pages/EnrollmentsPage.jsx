import { useEffect, useState } from 'react';
import {
  createEnrollment,
  deleteEnrollment,
  fetchCourses,
  fetchEnrollments,
  loadUser,
} from '../services/api.js';

function canListEnrollments(role) {
  return role === 'Admin' || role === 'Instructor';
}

function canCreateEnrollment(role) {
  return role === 'Admin' || role === 'Student';
}

function canDeleteEnrollment(role) {
  return role === 'Admin';
}

export default function EnrollmentsPage() {
  const user = loadUser();
  const uid = Number(user?.userId);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollCourseId, setEnrollCourseId] = useState('');
  const [enrollUserId, setEnrollUserId] = useState('');
  const [deleteUserId, setDeleteUserId] = useState('');
  const [deleteCourseId, setDeleteCourseId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadPageData() {
    setError('');
    setLoading(true);
    try {
      const courseData = await fetchCourses();
      const coursesList = Array.isArray(courseData) ? courseData : [];
      setCourses(coursesList);

      if (canListEnrollments(user?.role)) {
        const enrollmentData = await fetchEnrollments();
        setEnrollments(Array.isArray(enrollmentData) ? enrollmentData : []);
      }
      return { courses: coursesList };
    } catch (err) {
      setError(err.message || 'Failed to load enrollments');
      return { courses: [] };
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, []);

  useEffect(() => {
    if (user?.role === 'Student' && !enrollCourseId && courses.length > 0) {
      setEnrollCourseId(String(courses[0].id));
    }
  }, [courses, enrollCourseId, user?.role]);

  async function handleCreate(event) {
    event.preventDefault();
    setError('');
    try {
      const selectedUserId = user.role === 'Student' ? uid : parseInt(enrollUserId, 10);
      await createEnrollment({
        userId: selectedUserId,
        courseId: parseInt(enrollCourseId, 10),
      });
      const { courses: nextCourses } = await loadPageData();
      if (user?.role === 'Admin') setEnrollUserId('');
      if (Array.isArray(nextCourses) && nextCourses.length > 0) {
        setEnrollCourseId(String(nextCourses[0].id));
      } else {
        setEnrollCourseId('');
      }
    } catch (err) {
      setError(err.message || 'Enrollment failed');
    }
  }

  async function handleDelete(event) {
    event.preventDefault();
    setError('');
    try {
      await deleteEnrollment(parseInt(deleteUserId, 10), parseInt(deleteCourseId, 10));
      setDeleteUserId('');
      setDeleteCourseId('');
      await loadPageData();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  }

  return (
    <section className="card">
      <div className="row-heading">
        <h2>Enrollments</h2>
        <button type="button" className="small" onClick={loadPageData} disabled={loading}>Refresh</button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="hint">Loading...</p>}

      {canListEnrollments(user?.role) && enrollments.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Course</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((item) => (
                <tr key={`${item.userId}-${item.courseId}`}>
                  <td>#{item.userId} {item.userName}</td>
                  <td>#{item.courseId} {item.courseTitle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {canCreateEnrollment(user?.role) && (
        <details className="details-box" open>
          <summary>Create Enrollment (POST /api/Enrollments)</summary>
          <form onSubmit={handleCreate} className="form compact">
            <label>
              Course
              <select value={enrollCourseId} onChange={(e) => setEnrollCourseId(e.target.value)} required>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.id} - {course.title}
                  </option>
                ))}
              </select>
            </label>
            {user?.role === 'Admin' && (
              <label>
                Student User Id
                <input type="number" min={1} value={enrollUserId} onChange={(e) => setEnrollUserId(e.target.value)} required />
              </label>
            )}
            <button type="submit">Enroll</button>
          </form>
        </details>
      )}

      {canDeleteEnrollment(user?.role) && (
        <details className="details-box">
          <summary>Delete Enrollment (DELETE /api/Enrollments/{'{userId}'}/{'{courseId}'})</summary>
          <form onSubmit={handleDelete} className="form compact">
            <label>
              User Id
              <input type="number" min={1} value={deleteUserId} onChange={(e) => setDeleteUserId(e.target.value)} required />
            </label>
            <label>
              Course Id
              <input type="number" min={1} value={deleteCourseId} onChange={(e) => setDeleteCourseId(e.target.value)} required />
            </label>
            <button type="submit" className="danger">Remove Enrollment</button>
          </form>
        </details>
      )}
    </section>
  );
}

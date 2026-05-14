import { useEffect, useMemo, useState } from 'react';
import {
  createEnrollment,
  deleteEnrollment,
  fetchCourses,
  fetchEnrollments,
  fetchMyEnrollments,
  fetchUsers,
  loadUser,
} from '../services/api.js';
import {
  canCreateEnrollment,
  canDeleteEnrollment,
  canListEnrollments,
} from '../services/permissions.js';

export default function EnrollmentsPage() {
  const user = loadUser();
  const uid = Number(user?.userId);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [enrollCourseId, setEnrollCourseId] = useState('');
  const [enrollUserId, setEnrollUserId] = useState('');
  const [deleteUserId, setDeleteUserId] = useState('');
  const [deleteCourseId, setDeleteCourseId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const availableCourses = useMemo(() => {
    if (user?.role !== 'Student') return courses;
    const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));
    return courses.filter((course) => !enrolledCourseIds.has(course.id));
  }, [courses, enrollments, user?.role]);

  async function loadPageData() {
    setError('');
    setLoading(true);
    try {
      const courseData = await fetchCourses();
      const coursesList = Array.isArray(courseData) ? courseData : [];
      setCourses(coursesList);

      if (user?.role === 'Admin') {
        const studentData = await fetchUsers('Student');
        const studentList = Array.isArray(studentData) ? studentData : [];
        setStudents(studentList);
        if (!enrollUserId && studentList.length > 0) {
          setEnrollUserId(String(studentList[0].id));
        }
      }

      if (canListEnrollments(user?.role)) {
        const enrollmentData = await fetchEnrollments();
        setEnrollments(Array.isArray(enrollmentData) ? enrollmentData : []);
      } else if (user?.role === 'Student') {
        const mine = await fetchMyEnrollments();
        setEnrollments(Array.isArray(mine) ? mine : []);
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
    if (user?.role === 'Student' && !enrollCourseId && availableCourses.length > 0) {
      setEnrollCourseId(String(availableCourses[0].id));
    }
  }, [availableCourses, enrollCourseId, user?.role]);

  useEffect(() => {
    if (user?.role !== 'Admin') return;
    if (!enrollUserId && students.length > 0) setEnrollUserId(String(students[0].id));
    if (!deleteUserId && students.length > 0) setDeleteUserId(String(students[0].id));
    if (!deleteCourseId && courses.length > 0) setDeleteCourseId(String(courses[0].id));
  }, [students, courses, user?.role, enrollUserId, deleteUserId, deleteCourseId]);

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
      if (user?.role === 'Student') {
        const mine = await fetchMyEnrollments();
        const mineList = Array.isArray(mine) ? mine : [];
        setEnrollments(mineList);
        const mineIds = new Set(mineList.map((e) => e.courseId));
        const nextAvailable = (Array.isArray(nextCourses) ? nextCourses : []).find((c) => !mineIds.has(c.id));
        setEnrollCourseId(nextAvailable ? String(nextAvailable.id) : '');
      } else if (Array.isArray(nextCourses) && nextCourses.length > 0) {
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
    <>
      <div className="page-header">
        <h1>Enrollments</h1>
        <p>{user?.role === 'Student' ? 'Manage your course enrollments' : 'View and manage student enrollments'}</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Enrollment list */}
      <section className="card">
        <div className="card-header">
          <h2>{user?.role === 'Student' ? 'My Enrollments' : 'All Enrollments'}</h2>
          <button type="button" className="btn-sm" onClick={loadPageData} disabled={loading}>Refresh</button>
        </div>

        {loading && (
          <div className="loading-spinner"><div className="spinner" /></div>
        )}

        {!loading && enrollments.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">&#128101;</div>
            <h3>No enrollments yet</h3>
            <p>{user?.role === 'Student' ? 'Enroll in a course below.' : 'No students enrolled yet.'}</p>
          </div>
        )}

        {!loading && canListEnrollments(user?.role) && enrollments.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((item) => (
                  <tr key={`${item.userId}-${item.courseId}`}>
                    <td>
                      <span className="badge badge-primary" style={{ marginRight: '0.5rem' }}>#{item.userId}</span>
                      {item.userName}
                    </td>
                    <td>{item.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && user?.role === 'Student' && enrollments.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((item) => (
                  <tr key={`${item.userId}-${item.courseId}`}>
                    <td style={{ fontWeight: 600 }}>{item.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Enroll form */}
      {canCreateEnrollment(user?.role) && (
        <section className="card">
          <h2>{user?.role === 'Student' ? 'Enroll in a Course' : 'Create Enrollment'}</h2>
          <form onSubmit={handleCreate} className="form compact">
            <label>
              Course
              <select value={enrollCourseId} onChange={(e) => setEnrollCourseId(e.target.value)} required>
                {availableCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>
            {user?.role === 'Admin' && (
              <label>
                Student
                <select value={enrollUserId} onChange={(e) => setEnrollUserId(e.target.value)} required>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      #{student.id} - {student.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {user?.role === 'Student' && availableCourses.length === 0 && (
              <div className="alert alert-warning">You are already enrolled in all available courses.</div>
            )}
            <button
              type="submit"
              disabled={user?.role === 'Student' && availableCourses.length === 0}
            >
              Enroll
            </button>
          </form>
        </section>
      )}

      {/* Delete enrollment (admin) */}
      {canDeleteEnrollment(user?.role) && (
        <section className="card">
          <h2>Remove Enrollment</h2>
          <form onSubmit={handleDelete} className="form compact">
            <label>
              Student
              <select value={deleteUserId} onChange={(e) => setDeleteUserId(e.target.value)} required>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    #{student.id} - {student.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Course
              <select value={deleteCourseId} onChange={(e) => setDeleteCourseId(e.target.value)} required>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="danger" style={{ alignSelf: 'flex-start' }}>Remove Enrollment</button>
          </form>
        </section>
      )}
    </>
  );
}

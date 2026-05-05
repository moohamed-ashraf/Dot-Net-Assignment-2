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
      {user?.role === 'Student' && enrollments.length > 0 && (
        <div className="table-wrap">
          <h3>My Enrollments</h3>
          <table>
            <thead>
              <tr>
                <th>Course</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((item) => (
                <tr key={`${item.userId}-${item.courseId}`}>
                  <td>#{item.courseId} {item.courseTitle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {canCreateEnrollment(user?.role) && (
        <details className="details-box" open>
          <summary>{user?.role === 'Student' ? 'Choose Course and Enroll' : 'Create Enrollment (POST /api/Enrollments)'}</summary>
          <form onSubmit={handleCreate} className="form compact">
            <label>
              Course
              <select value={enrollCourseId} onChange={(e) => setEnrollCourseId(e.target.value)} required>
                {availableCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.id} - {course.title}
                  </option>
                ))}
              </select>
            </label>
            {user?.role === 'Admin' && (
              <label>
                Student User Id
                <select value={enrollUserId} onChange={(e) => setEnrollUserId(e.target.value)} required>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      #{student.id} - {student.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {user?.role === 'Student' && availableCourses.length === 0 ? (
              <p className="hint">You are already enrolled in all available courses.</p>
            ) : null}
            <button type="submit" disabled={user?.role === 'Student' && availableCourses.length === 0}>Enroll</button>
          </form>
        </details>
      )}

      {canDeleteEnrollment(user?.role) && (
        <details className="details-box">
          <summary>Delete Enrollment (DELETE /api/Enrollments/{'{userId}'}/{'{courseId}'})</summary>
          <form onSubmit={handleDelete} className="form compact">
            <label>
              User Id
              <select value={deleteUserId} onChange={(e) => setDeleteUserId(e.target.value)} required>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    #{student.id} - {student.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Course Id
              <select value={deleteCourseId} onChange={(e) => setDeleteCourseId(e.target.value)} required>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    #{course.id} - {course.title}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="danger">Remove Enrollment</button>
          </form>
        </details>
      )}
    </section>
  );
}

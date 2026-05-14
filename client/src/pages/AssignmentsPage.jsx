import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  fetchAssignments,
  createAssignment,
  fetchSubmissions,
  fetchMySubmission,
  createSubmission,
  gradeSubmission,
  fetchMyEnrollments,
  loadUser,
} from '../services/api.js';

export default function AssignmentsPage() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const user = loadUser();
  const role = user?.role;
  const isInstructor = role === 'Instructor' || role === 'Admin';
  const isStudent = role === 'Student';

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notEnrolled, setNotEnrolled] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [expanded, setExpanded] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);

  const [submitContent, setSubmitContent] = useState('');
  const [mySubmission, setMySubmission] = useState(null);

  const [gradeInputs, setGradeInputs] = useState({});

  async function loadAssignments() {
    setError('');
    setNotEnrolled(false);
    setLoading(true);
    try {
      if (isStudent) {
        const mine = await fetchMyEnrollments();
        const enrolledIds = new Set((Array.isArray(mine) ? mine : []).map((e) => e.courseId));
        if (!enrolledIds.has(Number(courseId))) {
          setNotEnrolled(true);
          setLoading(false);
          return;
        }
      }
      const data = await fetchAssignments(courseId);
      setAssignments(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err?.response?.status === 403) {
        setNotEnrolled(true);
      } else {
        setError(err.message || 'Failed to load assignments');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssignments();
  }, [courseId]);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      const dueDateUtc = dueDate ? new Date(dueDate).toISOString() : dueDate;
      await createAssignment(courseId, { title, description, dueDate: dueDateUtc });
      setTitle('');
      setDescription('');
      setDueDate('');
      setShowForm(false);
      await loadAssignments();
    } catch (err) {
      setError(err.message || 'Failed to create assignment');
    }
  }

  async function toggleExpand(assignmentId) {
    if (expanded === assignmentId) {
      setExpanded(null);
      setSubmissions([]);
      setMySubmission(null);
      return;
    }
    setExpanded(assignmentId);
    setSubsLoading(true);
    setSubmitContent('');
    setMySubmission(null);
    try {
      if (isInstructor) {
        const data = await fetchSubmissions(courseId, assignmentId);
        setSubmissions(Array.isArray(data) ? data : []);
      }
      if (isStudent) {
        const data = await fetchMySubmission(courseId, assignmentId);
        setMySubmission(data || null);
      }
    } catch {
      /* ignore */
    } finally {
      setSubsLoading(false);
    }
  }

  async function handleSubmit(e, assignmentId) {
    e.preventDefault();
    setError('');
    try {
      const result = await createSubmission(courseId, assignmentId, { content: submitContent });
      setMySubmission(result);
      setSubmitContent('');
    } catch (err) {
      setError(err.message || 'Failed to submit');
    }
  }

  async function handleGrade(e, assignmentId, submissionId) {
    e.preventDefault();
    const val = parseInt(gradeInputs[submissionId], 10);
    if (Number.isNaN(val) || val < 0 || val > 100) {
      setError('Grade must be 0-100');
      return;
    }
    setError('');
    try {
      await gradeSubmission(courseId, assignmentId, submissionId, val);
      const data = await fetchSubmissions(courseId, assignmentId);
      setSubmissions(Array.isArray(data) ? data : []);
      setGradeInputs((prev) => ({ ...prev, [submissionId]: '' }));
    } catch (err) {
      setError(err.message || 'Failed to grade');
    }
  }

  function isDueSoon(dateStr) {
    const due = new Date(dateStr);
    const now = new Date();
    const diff = due - now;
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
  }

  function isPastDue(dateStr) {
    return new Date(dateStr) < new Date();
  }

  return (
    <>
      <div className="page-header">
        <h1>Assignments</h1>
        <p>
          Course #{courseId} &mdash;
          <Link to="/courses" style={{ marginLeft: '0.5rem' }}>Back to Courses</Link>
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {notEnrolled && (
        <section className="card">
          <div className="empty-state">
            <div className="empty-icon">&#128683;</div>
            <h3>Not Enrolled</h3>
            <p>You must be enrolled in this course to view assignments and submit work.</p>
            <div className="btn-row" style={{ justifyContent: 'center', marginTop: '1rem' }}>
              <button type="button" className="btn-primary" onClick={() => navigate('/enrollments')}>Go to Enrollments</button>
              <button type="button" className="btn-secondary" onClick={() => navigate('/courses')}>Back to Courses</button>
            </div>
          </div>
        </section>
      )}

      {!notEnrolled && <>
      {/* Create assignment form */}
      {isInstructor && (
        <section className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-header">
            <h2>New Assignment</h2>
            <button
              type="button"
              className="btn-sm"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Create'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleCreate} className="form-grid">
              <label>
                Title
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Assignment title" required maxLength={200} />
              </label>
              <label>
                Description
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the assignment..." maxLength={4000} rows={3} />
              </label>
              <label>
                Due Date
                <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
              </label>
              <button type="submit">Create Assignment</button>
            </form>
          )}
        </section>
      )}

      {/* Assignments list */}
      <section className="card">
        <div className="card-header">
          <h2>All Assignments</h2>
          <button type="button" className="btn-sm" onClick={loadAssignments} disabled={loading}>Refresh</button>
        </div>

        {loading && (
          <div className="loading-spinner"><div className="spinner" /></div>
        )}

        {!loading && assignments.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">&#128221;</div>
            <h3>No assignments yet</h3>
            <p>{isInstructor ? 'Create your first assignment above.' : 'No assignments have been posted for this course.'}</p>
          </div>
        )}

        {!loading && assignments.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => (
                  <tr key={a.id} style={expanded === a.id ? { background: 'var(--accent-light)' } : {}}>
                    <td style={{ fontWeight: 600 }}>{a.title}</td>
                    <td style={{ color: 'var(--text-secondary)', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.description || '—'}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{new Date(a.dueDate).toLocaleDateString()}</td>
                    <td>
                      {isPastDue(a.dueDate)
                        ? <span className="badge badge-danger">Past due</span>
                        : isDueSoon(a.dueDate)
                          ? <span className="badge badge-warning">Due soon</span>
                          : <span className="badge badge-success">Open</span>}
                    </td>
                    <td>
                      <button type="button" className="btn-sm" onClick={() => toggleExpand(a.id)}>
                        {expanded === a.id ? 'Collapse' : (isInstructor ? 'Submissions' : 'View')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Expanded detail panel */}
        {expanded && (
          <div className="detail-panel" style={{ marginTop: '1rem' }}>
            {subsLoading && <div className="loading-spinner"><div className="spinner" /></div>}

            {/* Instructor: submissions */}
            {isInstructor && !subsLoading && (
              <>
                <h3>Submissions</h3>
                {submissions.length === 0 ? (
                  <p className="hint">No submissions yet.</p>
                ) : (
                  <div className="table-wrap" style={{ border: 'none' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Content</th>
                          <th>Submitted</th>
                          <th>Grade</th>
                          <th>Set Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.map((s) => (
                          <tr key={s.id}>
                            <td>
                              <span className="badge badge-primary" style={{ marginRight: '0.4rem' }}>#{s.studentId}</span>
                              {s.studentName}
                            </td>
                            <td style={{ maxWidth: 220, wordBreak: 'break-word', color: 'var(--text-secondary)' }}>{s.content}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{new Date(s.submittedAt).toLocaleString()}</td>
                            <td>
                              {s.grade != null
                                ? <span className="badge badge-success">{s.grade}/100</span>
                                : <span className="badge badge-warning">Pending</span>}
                            </td>
                            <td>
                              <form onSubmit={(e) => handleGrade(e, expanded, s.id)} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  placeholder="0-100"
                                  value={gradeInputs[s.id] || ''}
                                  onChange={(e) => setGradeInputs((prev) => ({ ...prev, [s.id]: e.target.value }))}
                                  style={{ width: '72px', padding: '0.4rem 0.5rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border2)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '0.85rem' }}
                                  required
                                />
                                <button type="submit" className="btn-sm">Grade</button>
                              </form>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {/* Student: submission or submit form */}
            {isStudent && !subsLoading && (
              <>
                <h3>Your Submission</h3>
                {mySubmission ? (
                  <div className="submission-card">
                    <p style={{ whiteSpace: 'pre-wrap' }}>{mySubmission.content}</p>
                    <hr className="divider" />
                    <p>
                      <strong>Submitted:</strong>{' '}
                      <span style={{ color: 'var(--text-secondary)' }}>{new Date(mySubmission.submittedAt).toLocaleString()}</span>
                    </p>
                    <p>
                      <strong>Grade:</strong>{' '}
                      {mySubmission.grade != null
                        ? <span className="badge badge-success">{mySubmission.grade}/100</span>
                        : <span className="badge badge-warning">Not graded yet</span>}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={(e) => handleSubmit(e, expanded)} className="form-grid">
                    <label>
                      Your Answer
                      <textarea
                        value={submitContent}
                        onChange={(e) => setSubmitContent(e.target.value)}
                        required
                        rows={4}
                        maxLength={8000}
                        placeholder="Write your submission here..."
                      />
                    </label>
                    <button type="submit">Submit</button>
                  </form>
                )}
              </>
            )}
          </div>
        )}
      </section>
      </>}
    </>
  );
}

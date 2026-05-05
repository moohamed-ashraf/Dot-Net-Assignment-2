export default function HomePage() {
  return (
    <section className="card">
      <h2>Home</h2>
      <p className="hint">
        This frontend integrates with the ASP.NET Core backend using React Router and Axios.
      </p>
      <ul>
        <li>Browse and manage courses</li>
        <li>Create/update course records</li>
        <li>Manage enrollments by role</li>
      </ul>
      <p className="hint">
        Roles: Student can enroll only, Instructor manages courses + views enrollments, Admin has full control.
      </p>
    </section>
  );
}

import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import CourseDetailsPage from './pages/CourseDetailsPage.jsx';
import CourseFormPage from './pages/CourseFormPage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import EnrollmentsPage from './pages/EnrollmentsPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Course Management</h1>
        <p className="sub">React Router + Axios + ASP.NET Core API</p>
      </header>

      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/courses"
          element={(
            <ProtectedRoute>
              <CoursesPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/courses/new"
          element={(
            <ProtectedRoute>
              <CourseFormPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/courses/:id"
          element={(
            <ProtectedRoute>
              <CourseDetailsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/enrollments"
          element={(
            <ProtectedRoute>
              <EnrollmentsPage />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="footer">
        Start API first, then run <code>npm run dev</code> in <code>client</code>.
      </footer>
    </div>
  );
}

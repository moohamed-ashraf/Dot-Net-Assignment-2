import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import CourseDetailsPage from './pages/CourseDetailsPage.jsx';
import CourseFormPage from './pages/CourseFormPage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import EnrollmentsPage from './pages/EnrollmentsPage.jsx';
import AssignmentsPage from './pages/AssignmentsPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

export default function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            )}
          />

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
              <ProtectedRoute allowedRoles={['Admin', 'Instructor']}>
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
            path="/courses/:id/assignments"
            element={(
              <ProtectedRoute>
                <AssignmentsPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/enrollments"
            element={(
              <ProtectedRoute allowedRoles={['Admin', 'Instructor', 'Student']}>
                <EnrollmentsPage />
              </ProtectedRoute>
            )}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

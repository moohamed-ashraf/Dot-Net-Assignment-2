# CourseForge Frontend (React + Axios)

This is the React frontend for CourseForge. It uses:

- React Router for client-side routes
- Axios for backend API calls
- `useState` and `useEffect` for state and UI updates

## Project structure

```text
src/
├── components/
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── CoursesPage.jsx
│   ├── CourseFormPage.jsx
│   ├── CourseDetailsPage.jsx
│   └── EnrollmentsPage.jsx
├── services/
│   └── api.js
├── App.jsx
├── main.jsx
└── index.css
```

## Routes

- `/` Home page
- `/login` Login page
- `/register` Register page
- `/courses` List courses
- `/courses/new` Add new course
- `/courses/:id` View and edit one course
- `/enrollments` Manage enrollments

## Setup and run

1. Run backend API in repository root:

```bash
dotnet run
```

2. In `client` directory:

```bash
npm install
npm run dev
```

3. Open `http://localhost:5173`

Vite proxies `/api` requests to `https://localhost:7231`.

## API routes used

- `POST /api/Auth/login`
- `POST /api/Auth/register`
- `GET /api/Courses`
- `GET /api/Courses/{id}`
- `POST /api/Courses`
- `PUT /api/Courses/{id}`
- `DELETE /api/Courses/{id}`
- `GET /api/Enrollments`
- `POST /api/Enrollments`
- `DELETE /api/Enrollments/{userId}/{courseId}`

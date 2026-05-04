# CourseForge - Backend + Frontend Integration

CourseForge is a full-stack course management project:

- Backend: ASP.NET Core Web API + Entity Framework Core + PostgreSQL
- Frontend: React + React Router + Axios
- Auth: JWT with role-based authorization (Admin, Instructor, Student)

## Backend setup

1. Install prerequisites:
   - .NET 8 SDK+
   - PostgreSQL

2. Copy `appsettings.example.json` to `appsettings.json` and set your PostgreSQL password and a strong `Jwt:Key` (do not commit `appsettings.json` with real secrets).

3. Apply migrations and run API:

```bash
dotnet ef database update
dotnet run
```

Default URLs from `Properties/launchSettings.json`:

- `https://localhost:7231`
- `http://localhost:5231`

Swagger:

- `https://localhost:7231/swagger`

## Frontend setup

From `client/`:

```bash
npm install
npm run dev
```

Frontend URL:

- `http://localhost:5173`

The Vite dev server proxies `/api` to `https://localhost:7231`.

## Frontend requirements mapping

- Structured React files: `components`, `pages`, `services`
- React Router routes:
  - `/`
  - `/login`
  - `/register`
  - `/courses`
  - `/courses/new`
  - `/courses/:id`
  - `/enrollments`
- State management via `useState` and `useEffect`
- API communication via Axios (`client/src/services/api.js`)
- CRUD forms for courses and enrollments

## API routes used by frontend

### Auth

- `POST /api/Auth/login`
- `POST /api/Auth/register`

### Courses

- `GET /api/Courses`
- `GET /api/Courses/{id}`
- `POST /api/Courses`
- `PUT /api/Courses/{id}`
- `DELETE /api/Courses/{id}`

### Enrollments

- `GET /api/Enrollments`
- `POST /api/Enrollments`
- `DELETE /api/Enrollments/{userId}/{courseId}`

## Screenshots

Add your final UI screenshots to `screenshots/` and include them in your submission.

## Demo flow

1. Start backend API.
2. Start frontend Vite app.
3. Login or register from frontend.
4. Show courses list, create a course, edit a course.
5. Show enrollments operations by role.

# CourseForge API

CourseForge API is a clean ASP.NET Core Web API project for managing courses, instructors, students, and enrollments.
It was designed to satisfy the assignment requirements for DTO validation, dependency injection, entity relationships,
JWT authentication, role-based authorization, LINQ projection, `AsNoTracking()`, EF Core migrations, and Swagger.

## Why this project fits the assignment
- **One-to-one**: `Instructor` ↔ `InstructorProfile`
- **One-to-many**: `Instructor` → `Courses`
- **Many-to-many**: `Student` ↔ `Course` through `Enrollment`
- **At least 3 services**: Auth, Student, Instructor, Course
- **DTOs**: create, update, and read DTOs are used
- **Validation**: DataAnnotations on DTOs
- **Authentication**: JWT login endpoint
- **Authorization**: role-based access using `Admin`, `Instructor`, and `User`
- **Optimized queries**: `Select()` projections and `AsNoTracking()` on read-only queries

## Technologies used
- **ASP.NET Core Web API**: framework for building REST APIs.
- **Entity Framework Core**: ORM used for data access and relationships.
- **SQLite**: lightweight database for simple local setup.
- **JWT Bearer Authentication**: secures endpoints using tokens.
- **Swagger / OpenAPI**: interactive API documentation and testing UI.
- **LINQ**: optimized querying and DTO projection.

## Run the project
```bash
git clone <your-repository-url>
cd CourseForge.Api
dotnet restore
dotnet ef database update
dotnet run
```

Swagger will open at:
- `https://localhost:7230/swagger`
- or `http://localhost:5230/swagger`

## Seeded login accounts
- **Admin**: `admin / admin123`
- **Instructor**: `instructor1 / Instructor123`
- **User**: `student1 / Student123`

## Example API endpoints
### Auth
- `POST /api/Auth/login`

### Students
- `GET /api/Students`
- `GET /api/Students/{id}`
- `POST /api/Students` (Admin)
- `PUT /api/Students/{id}` (Admin)
- `DELETE /api/Students/{id}` (Admin)

### Instructors
- `GET /api/Instructors`
- `GET /api/Instructors/{id}`
- `POST /api/Instructors` (Admin)
- `PUT /api/Instructors/{id}` (Admin)
- `DELETE /api/Instructors/{id}` (Admin)

### Courses
- `GET /api/Courses`
- `GET /api/Courses/{id}`
- `POST /api/Courses` (Admin, Instructor)
- `PUT /api/Courses/{id}` (Admin, Instructor)
- `DELETE /api/Courses/{id}` (Admin)
- `POST /api/Courses/enroll` (Admin, User)

## HTTP-only cookies and why they are common in industry
HTTP-only cookies are commonly used because JavaScript cannot read them directly in the browser. That reduces the risk of token theft through XSS attacks. They also work well with secure, same-site cookie policies and fit browser-based authentication flows. In many real systems, teams choose HTTP-only cookies for web apps while still using bearer tokens for APIs and mobile clients.

## Suggested screenshots for submission
After running the API, take screenshots for:
1. Swagger login request.
2. Protected endpoint with Bearer token.
3. Create student endpoint.
4. Create course endpoint.
5. Enroll student endpoint.

## Notes
- Passwords are plain text here only to keep the assignment simple. In a production project, always hash passwords.
- If your instructor wants PostgreSQL or SQL Server instead of SQLite, only the EF Core provider and connection string need to change.

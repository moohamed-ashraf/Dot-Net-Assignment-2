# 📘 CourseForge API — Course Management System

## 📌 Overview
CourseForge API is a RESTful backend system built using ASP.NET Core Web API for managing a university course system.  
The system allows management of students, instructors, courses, and enrollments, with secure authentication and role-based authorization.

This project demonstrates core backend engineering concepts including Entity Framework Core, Dependency Injection, DTO validation, JWT authentication, and optimized data querying using LINQ.

---

## 🎯 Features

- 🔐 JWT Authentication (Login system)
- 🛡️ Role-Based Authorization (Admin, Instructor, User)
- 📚 Course Management
- 👨‍🎓 Student Management
- 👨‍🏫 Instructor Management
- 🔗 Entity Relationships (1-1, 1-M, M-M)
- 📦 DTO-based architecture
- ✅ Request validation using Data Annotations
- ⚡ Optimized queries using LINQ projections
- 🚀 AsNoTracking for performance
- 📄 Swagger API documentation

---

## 🏗️ Technologies Used

| Technology | Description |
|----------|------------|
| ASP.NET Core Web API | Backend framework for building REST APIs |
| Entity Framework Core | ORM for database operations |
| SQLite | Lightweight database used for development |
| LINQ | Querying and optimizing data retrieval |
| JWT Authentication | Secure authentication mechanism |
| Swagger (Swashbuckle) | API documentation and testing |
| Dependency Injection | Service-based architecture |

---

## 🗄️ Database Design

### Relationships Implemented:
- One-to-One → Instructor ↔ InstructorProfile  
- One-to-Many → Instructor → Courses  
- Many-to-Many → Students ↔ Courses (via Enrollment)

---

## 🔐 Authentication & Authorization

### Login Endpoint:
POST /api/auth/login

### Example Request:
{
  "username": "admin",
  "password": "admin123"
}

### Usage:
Authorization: Bearer YOUR_TOKEN

---

## 🧪 API Testing (Swagger)

https://localhost:7230/swagger

---

## ⚙️ How to Run the Project

dotnet restore
dotnet ef database update
dotnet run

---

## 📊 LINQ Optimization

- Used Select() to return DTOs instead of full entities
- Used AsNoTracking() for read-only queries

---

## 🔒 Why HTTP-Only Cookies Are Used in Industry

HTTP-only cookies improve security by preventing JavaScript access, reducing XSS risks, and enabling safer session management.

---

## 📸 Screenshots Required

- Swagger homepage  
- Login response  
- Authorization  
- Working endpoint  

---

## 👨‍💻 Author
Mohamed Ashraf

---

## 📝 Notes
This project was developed for Web Engineering (ASP.NET Core) assignment.

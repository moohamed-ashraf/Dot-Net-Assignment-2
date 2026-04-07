# 📘 CourseForge API — Course Management System

## 📌 Overview

CourseForge API is a RESTful backend system built using ASP.NET Core Web API for managing a university course system.  
The system handles students, instructors, courses, and enrollments with secure authentication and role-based authorization.

This project demonstrates backend engineering concepts including Entity Framework Core, Dependency Injection, DTO validation, JWT authentication, and optimized LINQ queries.

---

## 🎯 Features

- JWT Authentication (Login system)
- Role-Based Authorization (Admin, Instructor, User)
- Course Management
- Student Management
- Instructor Management
- Entity Relationships (1-1, 1-M, M-M)
- DTO-based architecture
- Request validation using Data Annotations
- Optimized queries using LINQ (Select)
- Performance optimization using AsNoTracking()
- Swagger API documentation

---

## 🏗️ Technologies Used

| Technology            | Description                 |
| --------------------- | --------------------------- |
| ASP.NET Core Web API  | Backend framework           |
| Entity Framework Core | ORM for database            |
| PostgreSQL            | Relational database         |
| Npgsql                | PostgreSQL EF Core provider |
| LINQ                  | Query optimization          |
| JWT Authentication    | Secure login system         |
| Swagger               | API testing & documentation |
| Dependency Injection  | Clean architecture          |

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

### 1. Install prerequisites

- .NET SDK (8 or higher)
- PostgreSQL (v17 recommended)

### 2. Create database in PostgreSQL

Database name:
assingment2_db

### 3. Configure connection string

In appsettings.json:

"ConnectionStrings": {
"DefaultConnection": "Host=localhost;Port=5432;Database=assingment2_db;Username=postgres;Password=YOUR_PASSWORD"
}

### 4. Run commands

dotnet restore  
dotnet ef database update  
dotnet run

---

## 📊 LINQ Optimization

- Used Select() to return DTOs instead of full entities
- Used AsNoTracking() for read-only queries

---

## ✅ Validation

DTO validation using:

- Required
- MaxLength
- MinLength
- EmailAddress
- Range

Invalid requests return 400 Bad Request.

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

This project was updated to use PostgreSQL instead of SQLite.  
New EF Core migrations were generated and applied successfully.

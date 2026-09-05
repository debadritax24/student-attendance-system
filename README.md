# Attendify - Student Attendance Management System

A full-stack web application for managing student attendance. Built with Next.js 15 (App Router) — frontend pages and backend API run together on a single port with one command.

## Quick Start

```bash
npm install
cp .env.example .env.local    # edit with your MongoDB URI and JWT secret
npm run dev                    # http://localhost:3001
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Database | [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) |
| Validation | [Zod](https://zod.dev/) |
| Auth | [jose](https://github.com/panva/jose) (JWT) + HTTP-only cookies |
| Passwords | [bcryptjs](https://github.com/nicolo-ribaudo/bcryptjs) |

## Project Structure

```
├── package.json
├── tsconfig.json
├── next.config.mjs
├── .env.local                    # Environment variables (not committed)
├── .env.example                  # Environment variable template
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout with AuthProvider
│   │   ├── page.tsx              # Home → redirects to /login or /dashboard
│   │   ├── globals.css           # All styles
│   │   ├── login/page.tsx        # Login page
│   │   ├── dashboard/page.tsx    # Dashboard with stats
│   │   ├── students/
│   │   │   ├── page.tsx          # Student list (CRUD)
│   │   │   └── [id]/page.tsx     # Student detail view
│   │   ├── attendance/page.tsx   # Mark attendance
│   │   ├── subjects/page.tsx     # Subject management
│   │   ├── reports/page.tsx      # Attendance reports
│   │   ├── history/page.tsx      # Attendance history
│   │   ├── profile/page.tsx      # User profile
│   │   ├── settings/page.tsx     # App settings
│   │   └── api/                  # Backend API routes
│   │       ├── auth/login/route.ts
│   │       ├── auth/logout/route.ts
│   │       ├── users/route.ts
│   │       ├── users/[id]/route.ts
│   │       ├── students/route.ts
│   │       ├── students/[id]/route.ts
│   │       ├── subjects/route.ts
│   │       ├── subjects/[id]/route.ts
│   │       ├── attendance/route.ts
│   │       ├── attendance/[id]/route.ts
│   │       ├── attendance/bulk/route.ts
│   │       ├── attendance/history/[studentId]/route.ts
│   │       ├── reports/daily/route.ts
│   │       ├── reports/monthly/route.ts
│   │       ├── stats/dashboard/route.ts
│   │       ├── stats/subjects/route.ts
│   │       └── health/route.ts
│   ├── components/
│   │   ├── AppShell.tsx          # App layout wrapper (sidebar + main)
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   └── Navbar.tsx            # Top navbar with user info
│   ├── context/
│   │   └── AuthContext.tsx       # Client-side auth state (localStorage)
│   ├── lib/
│   │   ├── db.ts                 # MongoDB connection singleton
│   │   ├── auth.ts               # JWT cookie auth + role checking
│   │   ├── http.ts               # CORS + consistent API responses
│   │   └── query.ts              # Pagination helper
│   ├── models/
│   │   ├── User.ts
│   │   ├── Student.ts
│   │   ├── Subject.ts
│   │   └── Attendance.ts
│   └── validation.ts             # Zod schemas
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)

## Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

Edit `.env.local`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/attendify
JWT_SECRET=your-strong-random-secret-here
FRONTEND_URL=http://localhost:3001
```

## Running

```bash
# Development (starts on port 3001)
npm run dev

# Production build
npm run build
npm start

# Lint
npm run lint
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/logout` | Clear session cookie |

### Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create a new user |
| GET | `/api/users/:id` | Get a single user |
| PATCH | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

### Students

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | List all students |
| POST | `/api/students` | Create a new student |
| GET | `/api/students/:id` | Get a single student |
| PATCH | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

### Subjects

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/subjects` | List all subjects |
| POST | `/api/subjects` | Create a new subject |
| GET | `/api/subjects/:id` | Get a single subject |
| PATCH | `/api/subjects/:id` | Update a subject |
| DELETE | `/api/subjects/:id` | Delete a subject |

### Attendance

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/attendance` | List attendance records |
| POST | `/api/attendance` | Create attendance record |
| GET | `/api/attendance/:id` | Get a single record |
| PATCH | `/api/attendance/:id` | Update a record |
| DELETE | `/api/attendance/:id` | Delete a record |
| POST | `/api/attendance/bulk` | Bulk create attendance |
| GET | `/api/attendance/history/:studentId` | Student attendance history |

### Reports & Stats

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reports/daily?date=YYYY-MM-DD` | Daily attendance report |
| GET | `/api/reports/monthly?month=YYYY-MM` | Monthly attendance report |
| GET | `/api/stats/dashboard` | Dashboard statistics |
| GET | `/api/stats/subjects` | Subject-wise statistics |
| GET | `/api/health` | Health check |

## Roles

| Role | Permissions |
|---|---|
| **ADMIN** | Full access: manage users, students, subjects, attendance |
| **CR** | Manage attendance, students, and subjects (no user admin) |
| **STUDENT** | Read-only: view own attendance and student data |

## Response Format

All API responses follow a consistent shape:

```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "Error message" }
```

# Attendify

A full-stack attendance management platform for colleges, built with Next.js 15, React 19, and MongoDB.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Roles & Permissions](#roles--permissions)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Deployment](#deployment)
- [License](#license)

## Features

- **Role-Based Access** — Admin, CR, and Student roles with granular permissions.
- **Attendance Management** — Single and bulk attendance marking with real-time updates.
- **Student & Subject CRUD** — Full management of students, subjects, and class timetables.
- **Reports & Analytics** — Daily/monthly attendance reports and subject-wise statistics.
- **JWT Authentication** — Secure HTTP-only cookie sessions powered by `jose`.
- **Input Validation** — Request validation via `Zod` schemas across all API routes.
- **Responsive UI** — Mobile-first interface with a collapsible sidebar and navigation shell.
- **Seed Script** — Bootstrap the database with initial data for development.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) 5 |
| Database | [MongoDB](https://www.mongodb.com/) 7 + [Mongoose](https://mongoosejs.com/) 8 |
| Validation | [Zod](https://zod.dev/) 4 |
| Auth | [jose](https://github.com/panva/jose) (JWT) + HTTP-only cookies |
| Passwords | [bcryptjs](https://github.com/nicolo-ribaudo/bcryptjs) |

## Project Structure

```
attendify/
├── src/
│   ├── app/                  # Pages & API routes (App Router)
│   │   ├── api/              # REST API endpoints
│   │   ├── dashboard/        # Dashboard page
│   │   ├── students/         # Student list & detail pages
│   │   ├── subjects/         # Subjects page
│   │   ├── attendance/       # Attendance page
│   │   ├── reports/          # Reports page
│   │   ├── history/          # Attendance history page
│   │   ├── admin/            # Admin panel
│   │   ├── login/            # Login page
│   │   └── profile/          # User profile page
│   ├── components/           # Shared UI components (AppShell, Navbar, Sidebar)
│   ├── context/              # React context providers (AuthContext)
│   ├── lib/                  # Utilities (db, auth, http, query)
│   ├── models/               # Mongoose schemas (User, Student, Subject, Attendance, Timetable)
│   ├── scripts/              # Seed & maintenance scripts
│   └── validation.ts         # Zod validation schemas
├── package.json
├── tsconfig.json
└── next.config.mjs
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A [MongoDB](https://www.mongodb.com/) instance (local or Atlas)

### Installation

```bash
git clone https://github.com/debadritax24/attendify.git
cd attendify
npm install
```

Create a `.env.local` file in the project root (see [Environment Variables](#environment-variables)).

### Development

```bash
npm run dev
```

The app runs at [http://localhost:3001](http://localhost:3001).

### Production Build

```bash
npm run build
npm start
```

### Seed Database

```bash
npx tsx src/scripts/seed.ts
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/attendify` |
| `JWT_SECRET` | Strong random secret for signing JWTs | `your-strong-random-secret-here` |
| `FRONTEND_URL` | App base URL (used for CORS/redirects) | `http://localhost:3001` |

## Roles & Permissions

| Role | Access Level |
|------|-------------|
| **ADMIN** | Full access — manage users, students, subjects, attendance, and system settings. |
| **CR** | Class Representative — manage attendance, students, and subjects. |
| **STUDENT** | Read-only — view personal attendance and data. |

## API Reference

All endpoints return a consistent response format:

```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "Error message" }
```

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Sign in with email and password |
| POST | `/api/auth/logout` | Clear session cookie |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create a new user |
| GET | `/api/users/:id` | Get a user by ID |
| PATCH | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

### Students

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | List all students |
| POST | `/api/students` | Create a new student |
| GET | `/api/students/:id` | Get a student by ID |
| PATCH | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

### Subjects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subjects` | List all subjects |
| POST | `/api/subjects` | Create a new subject |
| GET | `/api/subjects/:id` | Get a subject by ID |
| PATCH | `/api/subjects/:id` | Update a subject |
| DELETE | `/api/subjects/:id` | Delete a subject |

### Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance` | List attendance records |
| POST | `/api/attendance` | Create an attendance record |
| GET | `/api/attendance/:id` | Get an attendance record by ID |
| PATCH | `/api/attendance/:id` | Update an attendance record |
| DELETE | `/api/attendance/:id` | Delete an attendance record |
| POST | `/api/attendance/bulk` | Bulk create attendance records |
| GET | `/api/attendance/history/:studentId` | Get attendance history for a student |

### Reports & Statistics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/daily?date=YYYY-MM-DD` | Daily attendance report |
| GET | `/api/reports/monthly?month=YYYY-MM` | Monthly attendance report |
| GET | `/api/stats/dashboard` | Dashboard statistics |
| GET | `/api/stats/subjects` | Subject-wise statistics |
| GET | `/api/timetable` | Class timetable |
| GET | `/api/health` | Health check |

## Data Models

| Model | Fields |
|-------|--------|
| **User** | name, email, password, role (ADMIN / CR / STUDENT) |
| **Student** | name, rollNumber, email, department, semester |
| **Subject** | name, code, department, semester |
| **Attendance** | student, subject, date, status (present / absent / late) |
| **Timetable** | subject, day, startTime, endTime, room |

## Deployment

1. Push the repository to [GitHub](https://github.com).
2. Import the project on [Vercel](https://vercel.com).
3. Set the required [environment variables](#environment-variables) in the Vercel dashboard.
4. Deploy — Vercel auto-detects Next.js and handles the build.

## License

[MIT](LICENSE)

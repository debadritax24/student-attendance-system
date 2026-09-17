# Attendify

A full-stack attendance management system for colleges, built with Next.js 15, React 19, and MongoDB.

## Overview

Attendify streamlines the attendance tracking workflow for colleges. Class Representatives (CRs) can mark and manage attendance per section, admins have full control over the system, and students can view their own attendance records. The system supports real-time attendance marking, bulk operations, daily and monthly reports, and a complete class timetable.

## Features

- **Role-Based Access Control** -- Admin, CR, and Student roles with granular route protection via middleware.
- **Attendance Management** -- Single and bulk attendance marking with Present/Absent/Late statuses.
- **Student & Subject CRUD** -- Full management of students, subjects, and enrollment data.
- **Timetable Management** -- Day-wise, period-wise class schedule with faculty, location, and class type.
- **Reports & Analytics** -- Daily and monthly attendance reports, subject-wise statistics, and per-student breakdowns.
- **JWT Authentication** -- Secure HTTP-only cookie-based sessions using `jose`.
- **Input Validation** -- Request validation via `Zod` schemas on all API routes.
- **Rate Limiting** -- Redis-backed rate limiting with in-memory fallback for login endpoints.
- **Structured Logging** -- Pino-based logging replacing raw `console.error` calls.
- **Seed Script** -- Bootstrap the database with real student data, subjects, and a full timetable.

## Tech Stack

| Layer          | Technology                                                     |
| -------------- | -------------------------------------------------------------- |
| Framework      | [Next.js 15](https://nextjs.org/) (App Router)                |
| UI             | [React 19](https://react.dev/)                                |
| Language       | [TypeScript](https://www.typescriptlang.org/) 5               |
| Database       | [MongoDB](https://www.mongodb.com/) 7 + [Mongoose](https://mongoosejs.com/) 8 |
| Validation     | [Zod](https://zod.dev/) 4                                     |
| Auth           | [jose](https://github.com/panva/jose) (JWT) + HTTP-only cookies |
| Passwords      | [bcryptjs](https://github.com/nicolo-ribaudo/bcryptjs)        |
| Logging        | [pino](https://github.com/pinojs/pino)                        |
| Testing        | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) |
| Linting        | [ESLint](https://eslint.org/) 10 + [Prettier](https://prettier.io/) |

## Project Structure

```
attendify/
├── src/
│   ├── app/                  # Pages and API routes (App Router)
│   │   ├── api/              # REST API endpoints
│   │   │   ├── auth/         # Login / Logout
│   │   │   ├── attendance/   # Attendance CRUD + bulk + history
│   │   │   ├── reports/      # Daily and monthly reports
│   │   │   ├── stats/        # Dashboard and subject statistics
│   │   │   ├── students/     # Student CRUD
│   │   │   ├── subjects/     # Subject CRUD
│   │   │   ├── timetable/    # Class timetable
│   │   │   └── users/        # User management (Admin only)
│   │   ├── admin/            # Admin panel
│   │   ├── cr/               # CR dashboard
│   │   ├── dashboard/        # Student dashboard
│   │   ├── login/            # Login page
│   │   ├── students/         # Student list and detail pages
│   │   ├── subjects/         # Subjects page
│   │   ├── attendance/       # Attendance page
│   │   ├── reports/          # Reports page
│   │   ├── history/          # Attendance history
│   │   ├── profile/          # User profile
│   │   └── settings/         # Settings
│   ├── components/           # Shared UI components (AppShell, Navbar, Sidebar)
│   ├── context/              # React context providers (AuthContext)
│   ├── lib/                  # Utilities (db, auth, http, query, redis, regex, logger)
│   ├── models/               # Mongoose schemas (User, Student, Subject, Attendance, Timetable)
│   ├── __tests__/            # Unit tests (auth, regex, http, rate-limit)
│   ├── scripts/              # Seed and maintenance scripts
│   └── validation.ts         # Zod validation schemas
├── .env.example              # Environment variable template
├── eslint.config.mjs         # ESLint flat config
├── vitest.config.ts          # Vitest test configuration
├── next.config.mjs           # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── package.json
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- A [MongoDB](https://www.mongodb.com/) instance (local or Atlas)

### Installation

```bash
git clone https://github.com/debadritax24/attendify.git
cd attendify
npm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable           | Description                                  | Example                                                  |
| ------------------ | -------------------------------------------- | -------------------------------------------------------- |
| `MONGODB_URI`      | MongoDB connection string                    | `mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/attendify` |
| `JWT_SECRET`       | Strong random secret for signing JWTs (min 32 chars) | `your-strong-random-secret-min-32-chars`                |
| `NEXT_PUBLIC_APP_URL` | App base URL (used for CORS)              | `http://localhost:3001`                                   |
| `REDIS_URL`        | Redis connection string (optional)           | `redis://localhost:6379`                                  |

### Development

```bash
npm run dev
```

The app runs at [http://localhost:3001](http://localhost:3001).

### Seed Database

```bash
npx tsx src/scripts/seed.ts
```

This populates the database with:
- 61 students (CSE Semester 3, Section E)
- 12 subjects with correct university course codes
- A full weekly timetable matching the official class routine
- Admin, CR, and Student user accounts

### Login Credentials

| Role    | Email                  | Password  |
| ------- | ---------------------- | --------- |
| ADMIN   | admin@attendify.com    | admin123  |
| CR      | deba@attendify.com     | deba123   |
| STUDENT | stu@attendify.com      | stu123    |

### Production Build

```bash
npm run build
npm start
```

### Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Linting & Formatting

```bash
npm run lint          # Check for lint errors
npm run lint:fix      # Auto-fix lint errors
npm run format        # Format with Prettier
npm run format:check  # Check formatting
```

## Roles & Permissions

| Role      | Access Level                                                                |
| --------- | --------------------------------------------------------------------------- |
| **ADMIN** | Full access -- manage users, students, subjects, attendance, timetable, and system settings. |
| **CR**    | Class Representative -- mark attendance, manage students, view reports and timetable. |
| **STUDENT** | Read-only -- view personal attendance, timetable, and reports.            |

Route protection is enforced via `src/middleware.ts` with role-based blocking on both page routes and API endpoints.

## API Reference

All endpoints return a consistent JSON response format:

```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "Error message" }
```

### Authentication

| Method | Endpoint              | Description                  | Auth     |
| ------ | --------------------- | ---------------------------- | -------- |
| POST   | `/api/auth/login`     | Sign in with email/password  | Public   |
| POST   | `/api/auth/logout`    | Clear session cookie         | Public   |

### Students

| Method | Endpoint               | Description              | Auth           |
| ------ | ---------------------- | ------------------------ | -------------- |
| GET    | `/api/students`        | List students (paginated, filterable by department/section/semester/search) | ADMIN, CR, STUDENT |
| POST   | `/api/students`        | Create a student         | ADMIN, CR      |
| GET    | `/api/students/:id`    | Get student by ID        | ADMIN, CR, STUDENT |
| PATCH  | `/api/students/:id`    | Update a student         | ADMIN, CR      |
| DELETE | `/api/students/:id`    | Delete a student         | ADMIN          |

### Subjects

| Method | Endpoint               | Description              | Auth           |
| ------ | ---------------------- | ------------------------ | -------------- |
| GET    | `/api/subjects`        | List subjects            | ADMIN, CR, STUDENT |
| POST   | `/api/subjects`        | Create a subject         | ADMIN, CR      |
| GET    | `/api/subjects/:id`    | Get subject by ID        | ADMIN, CR, STUDENT |
| PATCH  | `/api/subjects/:id`    | Update a subject         | ADMIN, CR      |
| DELETE | `/api/subjects/:id`    | Delete a subject         | ADMIN          |

### Attendance

| Method | Endpoint                                | Description                     | Auth           |
| ------ | --------------------------------------- | ------------------------------- | -------------- |
| GET    | `/api/attendance`                       | List attendance records         | ADMIN, CR      |
| POST   | `/api/attendance`                       | Create an attendance record     | ADMIN, CR      |
| GET    | `/api/attendance/:id`                   | Get attendance record by ID     | ADMIN, CR      |
| PATCH  | `/api/attendance/:id`                   | Update an attendance record     | ADMIN, CR      |
| DELETE | `/api/attendance/:id`                   | Delete an attendance record     | ADMIN          |
| POST   | `/api/attendance/bulk`                  | Bulk create attendance records  | ADMIN, CR      |
| GET    | `/api/attendance/history/:studentId`    | Get attendance history (paginated) | ADMIN, CR, STUDENT |

### Reports & Statistics

| Method | Endpoint                          | Description                   | Auth           |
| ------ | --------------------------------- | ----------------------------- | -------------- |
| GET    | `/api/reports/daily?date=YYYY-MM-DD` | Daily attendance report    | ADMIN, CR      |
| GET    | `/api/reports/monthly?month=YYYY-MM` | Monthly attendance report  | ADMIN, CR      |
| GET    | `/api/stats/dashboard`            | Dashboard statistics          | ADMIN, CR, STUDENT |
| GET    | `/api/stats/subjects`             | Subject-wise statistics       | ADMIN, CR      |
| GET    | `/api/timetable`                  | Class timetable               | ADMIN, CR, STUDENT |
| GET    | `/api/health`                     | Health check                  | Public         |

### Users (Admin Only)

| Method | Endpoint          | Description        | Auth  |
| ------ | ----------------- | ------------------ | ----- |
| GET    | `/api/users`      | List all users     | ADMIN |
| POST   | `/api/users`      | Create a user      | ADMIN |
| GET    | `/api/users/:id`  | Get user by ID     | ADMIN |
| PATCH  | `/api/users/:id`  | Update a user      | ADMIN |
| DELETE | `/api/users/:id`  | Delete a user      | ADMIN |

## Data Models

### User

| Field        | Type     | Description                          |
| ------------ | -------- | ------------------------------------ |
| name         | String   | Full name                            |
| email        | String   | Email address (unique)               |
| passwordHash | String   | Bcrypt-hashed password               |
| role         | Enum     | `ADMIN`, `CR`, or `STUDENT`          |
| studentId    | ObjectId | Reference to Student (optional)      |

### Student

| Field           | Type   | Description                          |
| --------------- | ------ | ------------------------------------ |
| rollNumber      | String | University roll number (unique)      |
| enrollmentNumber | String | University enrollment number         |
| name            | String | Student full name                    |
| email           | String | Email address                        |
| department      | String | Department (e.g., CSE)               |
| semester        | Number | Current semester                     |
| section         | String | Section identifier (e.g., CSE-III-E) |
| active          | Boolean | Active status                       |

### Subject

| Field      | Type   | Description                          |
| ---------- | ------ | ------------------------------------ |
| code       | String | Course code (unique, e.g., CSE11108) |
| name       | String | Subject name                         |
| department | String | Department                           |
| semester   | Number | Semester                             |
| section    | String | Section                              |

### Attendance

| Field   | Type     | Description                          |
| ------- | -------- | ------------------------------------ |
| student | ObjectId | Reference to Student                 |
| subject | ObjectId | Reference to Subject                 |
| date    | Date     | Attendance date                      |
| status  | Enum     | `PRESENT`, `ABSENT`, or `LATE`       |

### Timetable

| Field       | Type   | Description                          |
| ----------- | ------ | ------------------------------------ |
| day         | String | Day of the week                      |
| period      | Number | Period number (1-8)                  |
| startTime   | String | Period start time (HH:MM)            |
| endTime     | String | Period end time (HH:MM)              |
| subject     | String | Subject name                         |
| subjectCode | String | Course code                          |
| faculty     | String | Faculty name                         |
| location    | String | Room/lab location                    |
| type        | Enum   | `lecture`, `lab`, `library`, `activity`, or `free` |
| section     | String | Section identifier                   |
| semester    | Number | Semester                             |

## Security

- Passwords are hashed with `bcryptjs` (10 salt rounds).
- JWT tokens are stored in HTTP-only, `SameSite=Lax` cookies.
- All protected routes are enforced via Next.js middleware.
- Rate limiting on login endpoints (5 attempts per 15 minutes).
- Input validation via Zod on all API routes.
- Security headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `X-XSS-Protection`, `Permissions-Policy`.

## License

[MIT](LICENSE)

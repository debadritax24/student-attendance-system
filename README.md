# Attendify - Student Attendance Management System

A full-stack web application for managing student attendance, built with a Next.js 15 API backend and a vanilla HTML/CSS/JS frontend.

## Tech Stack

**Frontend**

- HTML5, CSS3, Vanilla JavaScript
- Chart.js (CDN) for dashboard charts
- No build step required

**Backend**

- [Next.js 15](https://nextjs.org/) (App Router, API Routes)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) ODM
- [Zod](https://zod.dev/) for request validation
- [jose](https://github.com/panva/jose) for JWT authentication
- [bcryptjs](https://github.com/nicolo-ribaudo/bcryptjs) for password hashing

## Project Structure

```
├── index.html                  # Entry point (redirects to login)
├── package.json                # Root convenience scripts
├── css/
│   └── style.css               # Single consolidated stylesheet
├── js/
│   ├── common.js               # Shared utilities (auth, sidebar, toast, modal)
│   ├── data.js                 # Sample student/subject/attendance data
│   ├── login.js                # Login form logic
│   ├── students.js             # Student list CRUD + filtering
│   ├── student-details.js      # Individual student view + chart
│   ├── attendance.js           # Attendance marking interface
│   ├── subjects.js             # Subject management
│   ├── history.js              # Attendance history view
│   └── reports.js              # Reports logic
├── pages/
│   ├── login.html              # Login page
│   ├── dashboard.html          # Admin/CR dashboard with charts
│   ├── students.html           # Student list with add/edit/delete
│   ├── student-details.html    # Single student detail + attendance chart
│   ├── attendance.html         # Mark daily attendance
│   ├── subjects.html           # Manage subjects
│   ├── reports.html            # Attendance summary reports
│   ├── history.html            # Attendance history log
│   ├── profile.html            # User profile
│   └── settings.html           # App settings
└── server/                     # Next.js API backend
    ├── package.json
    ├── tsconfig.json
    ├── .env.example            # Environment variable template
    └── src/
        ├── validation.ts       # Zod validation schemas
        ├── lib/
        │   ├── db.ts           # MongoDB connection singleton
        │   ├── auth.ts         # JWT cookie auth + role checking
        │   ├── http.ts         # CORS + consistent API responses
        │   └── query.ts        # Pagination helper
        ├── models/
        │   ├── User.ts         # User model (ADMIN, CR, STUDENT)
        │   ├── Student.ts      # Student model
        │   ├── Subject.ts      # Subject model
        │   └── Attendance.ts   # Attendance model (unique: student+subject+date)
        └── app/
            ├── actions.ts      # Server action (getCurrentUser)
            └── api/            # 17 API route handlers
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)

## Setup

### 1. Install root dependencies (optional, for convenience scripts)

```bash
npm install
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env.local
```

Edit `server/.env.local` and set:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/attendify
JWT_SECRET=your-strong-random-secret-here
FRONTEND_URL=http://localhost:3000
```

### 3. Start the backend

```bash
# From server/
npm run dev      # Development (http://localhost:3001)

# From root
npm run dev      # Same thing
```

### 4. Open the frontend

Open `index.html` in a browser, or serve the project root:

```bash
npx serve .
```

The frontend communicates with the backend at `http://localhost:3001`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start backend dev server on port 3001 |
| `npm run build` | Production build of the Next.js backend |
| `npm start` | Start production server on port 3001 |
| `npm run lint` | Run ESLint on backend code |
| `npm run install:all` | Install backend dependencies |

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
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": "Error message" }
```

## Notes

- The MongoDB compound unique index on `(student, subject, date)` prevents duplicate attendance records
- JWT tokens are stored in HTTP-only cookies for security
- Attendance percentage counts both PRESENT and LATE statuses as attended
- The frontend uses `localStorage` to persist login state between page reloads

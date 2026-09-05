# Attendify - Student Attendance Management System

A full-stack student attendance management system with a Next.js API backend and static HTML/CSS/JS frontend.

## Project Structure

```
├── index.html              # Entry point (redirects to login)
├── package.json            # Root convenience scripts
├── css/
│   └── style.css           # Consolidated stylesheet
├── js/
│   ├── common.js           # Shared utility functions
│   ├── data.js             # Sample data
│   ├── login.js            # Login logic
│   ├── students.js         # Student list logic
│   ├── student-details.js  # Student detail view
│   ├── attendance.js       # Attendance marking
│   ├── subjects.js         # Subject management
│   ├── history.js          # Attendance history
│   └── reports.js          # Reports logic
├── pages/
│   ├── login.html          # Login page
│   ├── dashboard.html      # Admin/CR dashboard
│   ├── students.html       # Student list
│   ├── student-details.html # Student detail view
│   ├── attendance.html     # Mark attendance
│   ├── subjects.html       # Manage subjects
│   ├── reports.html        # Attendance reports
│   ├── history.html        # Attendance history
│   ├── profile.html        # User profile
│   └── settings.html       # App settings
└── server/                 # Next.js API backend
    ├── package.json
    ├── tsconfig.json
    ├── .env.example
    └── src/
        ├── validation.ts   # Zod validation schemas
        ├── lib/            # DB, auth, HTTP helpers
        ├── models/         # Mongoose models
        └── app/api/        # API route handlers
```

## Setup

### Backend

```bash
cd server
npm install
cp .env.example .env.local
```

Set `MONGODB_URI` and a strong `JWT_SECRET` in `.env.local`.

```bash
npm run dev    # Starts on port 3001
```

### Frontend

Open `index.html` in a browser, or serve the project root with any static file server:

```bash
npx serve .
```

The frontend calls `http://localhost:3001` for API requests.

## API Endpoints

- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET/POST /api/users` - User management
- `GET/PATCH/DELETE /api/users/:id` - Single user
- `GET/POST /api/students` - Student management
- `GET/PATCH/DELETE /api/students/:id` - Single student
- `GET/POST /api/subjects` - Subject management
- `GET/PATCH/DELETE /api/subjects/:id` - Single subject
- `GET/POST /api/attendance` - Attendance records
- `GET/PATCH/DELETE /api/attendance/:id` - Single record
- `POST /api/attendance/bulk` - Bulk attendance
- `GET /api/attendance/history/:studentId` - Student history
- `GET /api/reports/daily?date=YYYY-MM-DD` - Daily report
- `GET /api/reports/monthly?month=YYYY-MM` - Monthly report
- `GET /api/stats/dashboard` - Dashboard stats
- `GET /api/stats/subjects` - Subject stats
- `GET /api/health` - Health check

## Roles

- **ADMIN**: Full management access
- **CR**: Attendance, students, and subjects management
- **STUDENT**: Read-only access to attendance and student data

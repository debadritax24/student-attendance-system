# Attendify Backend

Next.js App Router API backend using the Node.js runtime, MongoDB/Mongoose, Zod validation and JWT HTTP-only cookie authentication.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `MONGODB_URI` and a strong `JWT_SECRET`.

## API groups

- `POST /api/auth/login`, `POST /api/auth/logout`
- `GET/POST /api/users`
- `GET/PATCH/DELETE /api/users/:id`
- `GET/POST /api/students`
- `GET/PATCH/DELETE /api/students/:id`
- `GET/POST /api/subjects`
- `GET/PATCH/DELETE /api/subjects/:id`
- `GET/POST /api/attendance`
- `GET/PATCH/DELETE /api/attendance/:id`
- `POST /api/attendance/bulk`
- `GET /api/attendance/history/:studentId`
- `GET /api/reports/daily?date=YYYY-MM-DD`
- `GET /api/reports/monthly?month=YYYY-MM`
- `GET /api/stats/dashboard`
- `GET /api/stats/subjects`
- `GET /api/health`

## Roles

- ADMIN: full management access.
- CR: attendance, students and subjects management; no user administration.
- STUDENT: read attendance/student/subject data and own attendance history.

Attendance percentage counts PRESENT + LATE as attended.

## Notes

The database layer is isolated in `src/lib/db.ts`, models are in `src/models`, validation is centralized, and API responses use consistent `{ success, data }` / `{ success:false, error }` shapes. The MongoDB unique compound index prevents duplicate attendance for a student/subject/date combination.

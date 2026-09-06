# Attendify

Smart attendance management system for colleges. Full-stack Next.js app — API and UI on a single port.

## Tech Stack

- **Framework** — [Next.js 15](https://nextjs.org/) (App Router)
- **UI** — [React 19](https://react.dev/)
- **Language** — [TypeScript](https://www.typescriptlang.org/)
- **Database** — [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- **Validation** — [Zod](https://zod.dev/)
- **Auth** — [jose](https://github.com/panva/jose) (JWT) + HTTP-only cookies
- **Passwords** — [bcryptjs](https://github.com/nicolo-ribaudo/bcryptjs)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A [MongoDB](https://www.mongodb.com/) instance (local or Atlas)

### Setup

```bash
git clone https://github.com/debadritax24/attendify.git
cd attendify
npm install
```

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/attendify
JWT_SECRET=your-strong-random-secret-here
FRONTEND_URL=http://localhost:3001
```

### Run

```bash
npm run dev       # http://localhost:3001
```

### Build

```bash
npm run build
npm start
```

## Roles

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full access — manage users, students, subjects, attendance |
| **CR** | Manage attendance, students, and subjects |
| **STUDENT** | Read-only — view own attendance and data |

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Sign in with email/password |
| POST | `/api/auth/logout` | Clear session cookie |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users |
| POST | `/api/users` | Create user |
| GET | `/api/users/:id` | Get user |
| PATCH | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Students

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | List students |
| POST | `/api/students` | Create student |
| GET | `/api/students/:id` | Get student |
| PATCH | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |

### Subjects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subjects` | List subjects |
| POST | `/api/subjects` | Create subject |
| GET | `/api/subjects/:id` | Get subject |
| PATCH | `/api/subjects/:id` | Update subject |
| DELETE | `/api/subjects/:id` | Delete subject |

### Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance` | List attendance records |
| POST | `/api/attendance` | Create attendance record |
| GET | `/api/attendance/:id` | Get attendance record |
| PATCH | `/api/attendance/:id` | Update attendance record |
| DELETE | `/api/attendance/:id` | Delete attendance record |
| POST | `/api/attendance/bulk` | Bulk create attendance |
| GET | `/api/attendance/history/:studentId` | Student attendance history |

### Reports & Stats

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/daily?date=YYYY-MM-DD` | Daily attendance report |
| GET | `/api/reports/monthly?month=YYYY-MM` | Monthly attendance report |
| GET | `/api/stats/dashboard` | Dashboard statistics |
| GET | `/api/stats/subjects` | Subject-wise statistics |
| GET | `/api/health` | Health check |

## Response Format

```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "Error message" }
```

## Deployment

Push to GitHub and import on [Vercel](https://vercel.com). Set these environment variables in the Vercel dashboard:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong random secret |
| `FRONTEND_URL` | Your Vercel deployment URL |

## License

MIT

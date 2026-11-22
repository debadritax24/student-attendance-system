import bcrypt from "bcryptjs";

export function isMongoConnectionError(e: unknown): boolean {
  if (!e || typeof e !== "object") return false;
  const err = e as any;
  const msg = typeof err.message === "string" ? err.message.toLowerCase() : "";
  const code = err.code;
  const codeName = typeof err.codeName === "string" ? err.codeName : "";
  const name = typeof err.name === "string" ? err.name : "";

  return (
    code === "ENOTFOUND" ||
    code === "ECONNREFUSED" ||
    code === "ETIMEDOUT" ||
    code === 8000 || // Atlas bad auth / authentication error
    code === 18 || // MongoDB AuthFailed
    codeName === "AtlasError" ||
    codeName === "AuthenticationFailed" ||
    name === "MongooseServerSelectionError" ||
    name === "MongoServerSelectionError" ||
    name === "MongoNetworkError" ||
    name === "MongoTopologyClosedError" ||
    (name === "MongoServerError" && (code === 8000 || code === 18 || msg.includes("auth"))) ||
    msg.includes("querysrv") ||
    msg.includes("econnrefused") ||
    msg.includes("enotfound") ||
    msg.includes("bad auth") ||
    msg.includes("authentication failed") ||
    msg.includes("auth failed") ||
    msg.includes("server selection timed out") ||
    msg.includes("whitelisted") ||
    msg.includes("whitelist")
  );
}

// 1. Mock Users
export const MOCK_USERS = [
  {
    _id: "64f1a2b3c4d5e6f7a8b9c0d1",
    name: "Debadrita Goswami",
    email: "deba@attendify.com",
    role: "CR",
    passwordHash: bcrypt.hashSync("deba123", 10),
    studentId: "64f1a2b3c4d5e6f7a8b9c100",
  },
  {
    _id: "64f1a2b3c4d5e6f7a8b9c0d2",
    name: "Admin User",
    email: "admin@attendify.com",
    role: "ADMIN",
    passwordHash: bcrypt.hashSync("admin123", 10),
    studentId: null,
  },
  {
    _id: "64f1a2b3c4d5e6f7a8b9c0d3",
    name: "Debadrita Goswami",
    email: "stu@attendify.com",
    role: "STUDENT",
    passwordHash: bcrypt.hashSync("stu123", 10),
    studentId: "64f1a2b3c4d5e6f7a8b9c100",
  },
];

// 2. Mock Subjects
export const MOCK_SUBJECTS = [
  { _id: "64f1a2b3c4d5e6f7a8b9c201", code: "CSE11103", name: "Principles of Programming Language", department: "CSE", semester: 3, section: "E", faculty: "Dr. Arnab Sinha" },
  { _id: "64f1a2b3c4d5e6f7a8b9c202", code: "CSE11104", name: "Data Structures and Algorithms", department: "CSE", semester: 3, section: "E", faculty: "Mr. Subhra Prokash Dutta" },
  { _id: "64f1a2b3c4d5e6f7a8b9c203", code: "CSE11105", name: "Switching Circuits and Logic Design", department: "CSE", semester: 3, section: "E", faculty: "Dr. Shukla Banik" },
  { _id: "64f1a2b3c4d5e6f7a8b9c204", code: "CSE11108", name: "Database Management Systems", department: "CSE", semester: 3, section: "E", faculty: "Mr. Victor Das" },
  { _id: "64f1a2b3c4d5e6f7a8b9c205", code: "SDS11510", name: "Engineering Mathematics - III C", department: "CSE", semester: 3, section: "E", faculty: "Faculty" },
  { _id: "64f1a2b3c4d5e6f7a8b9c206", code: "IDP14001", name: "Interdisciplinary Project", department: "CSE", semester: 3, section: "E", faculty: "Faculty" },
  { _id: "64f1a2b3c4d5e6f7a8b9c207", code: "SOC14100", name: "Community Service", department: "CSE", semester: 3, section: "E", faculty: "Faculty" },
  { _id: "64f1a2b3c4d5e6f7a8b9c208", code: "CSE12106", name: "Programming Language Lab", department: "CSE", semester: 3, section: "E", faculty: "Dr. Arnab Sinha" },
  { _id: "64f1a2b3c4d5e6f7a8b9c209", code: "CSE12107", name: "Data Structures Lab", department: "CSE", semester: 3, section: "E", faculty: "Mr. Subhra Prokash Dutta" },
  { _id: "64f1a2b3c4d5e6f7a8b9c210", code: "CSE12113", name: "DBMS Lab", department: "CSE", semester: 3, section: "E", faculty: "Mr. Victor Das" },
];

// 3. Mock Students (61 students from seed script)
const RAW_STUDENT_NAMES = [
  "Ayan Mondal", "Monalisa Panda", "Ankita Jana", "Nilanjana Sarkar", "Sunandan Ghosh",
  "Sk Sahil Ahmed", "Samayan Roy", "Tamanna Bisiwas", "Dipon Das", "Subhadeep dutta",
  "Saptartimi Saha", "Priyangshu Paul", "Aryan Pandey", "Kishaloy Mondal", "Reyansh Dalui",
  "Srisyaditya Bose", "Mohit Saha", "Aaditya Mallick", "Talha Talwekar", "Neha Adhikari",
  "Nilanilina Dutta", "Sukriti Biswas", "Satyam Kumar", "Ashik Mondal", "Partho Majumder",
  "Subhajit Daripa", "Shaunk Shah", "Thangam Borish Meitei", "Sourangshu Mallick", "Shubynyuti Dhar",
  "Rajbir Saha", "Abdul Matin", "Anshankhan Mandal", "Ankit Yadav", "Harsh Ray",
  "Surajit Dey", "Kusumita Mondal", "Ranit Samui", "Shilpa Sahoo", "Shirshendu Ghosh",
  "Tuhin Majumdar", "Rimi Saha", "Shreyasree Ghosh Mondal", "Pramit Mukherjee", "Ankhi Biswas",
  "Sayak Biswas", "Aditi Palit", "Ramanda Dinda", "Banhita Chakraborty", "Soumidip Chakraborty",
  "Debadrita Goswami", "Ayush Biswas", "Pritam Das", "Rohan Mukherjee", "Sneha Roy",
  "Arka Sen", "Ritika Paul", "Aniket Banerjee", "Bipasha Das", "Souvik Das", "Rishi Roy"
];

const DUMMY_RATES = [92, 88, 76, 94, 82, 68, 90, 85, 71, 95, 89, 78, 86, 91, 74, 88, 93, 80, 87, 96];

export const MOCK_STUDENTS = RAW_STUDENT_NAMES.map((name, idx) => ({
  _id: `64f1a2b3c4d5e6f7a8b9c1${String(idx).padStart(2, "0")}`,
  rollNumber: `UG/04/BT/CSE/2025/${281 + idx}`,
  enrollmentNumber: `AU/2025/${String(2970 + idx * 15).padStart(6, "0")}`,
  name,
  email: `${name.toLowerCase().replace(/[^a-z]/g, "")}@attendify.com`,
  department: "CSE",
  semester: 3,
  section: "E",
  active: true,
  attendancePercentage: DUMMY_RATES[idx % DUMMY_RATES.length],
}));

// 4. Periods & Routine
const PERIOD_TIMES = [
  { period: 1, startTime: "09:30", endTime: "10:25" },
  { period: 2, startTime: "10:30", endTime: "11:25" },
  { period: 3, startTime: "11:30", endTime: "12:25" },
  { period: 4, startTime: "12:30", endTime: "13:25" },
  { period: 5, startTime: "13:30", endTime: "14:25" },
  { period: 6, startTime: "14:30", endTime: "15:25" },
  { period: 7, startTime: "15:30", endTime: "16:25" },
  { period: 8, startTime: "16:30", endTime: "17:25" },
];

export const MOCK_TIMETABLE: any[] = [];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const BASE_SCHEDULE: Record<string, { period: number; subject: string; subjectCode: string; faculty: string; location: string; type: string }[]> = {
  Monday: [
    { period: 1, subject: "Database Management Systems", subjectCode: "CSE11108", faculty: "Mr. Victor Das", location: "AU6-LH-201", type: "lecture" },
    { period: 2, subject: "Principles of Programming Language", subjectCode: "CSE11103", faculty: "Dr. Arnab Sinha", location: "AU6-LH-201", type: "lecture" },
    { period: 3, subject: "Interdisciplinary Project", subjectCode: "IDP14001", faculty: "Faculty", location: "AU6-LH-201", type: "activity" },
    { period: 4, subject: "Library Session", subjectCode: "", faculty: "", location: "Central Library", type: "library" },
    { period: 6, subject: "Switching Circuits & Logic Design", subjectCode: "CSE11105", faculty: "Dr. Shukla Banik", location: "AU6-LH-201", type: "lecture" },
    { period: 7, subject: "Engineering Mathematics - III C", subjectCode: "SDS11510", faculty: "Faculty", location: "AU6-LH-201", type: "lecture" },
  ],
  Tuesday: [
    { period: 1, subject: "Principles of Programming Language", subjectCode: "CSE11103", faculty: "Dr. Arnab Sinha", location: "AU6-LH-201", type: "lecture" },
    { period: 3, subject: "Database Management Systems", subjectCode: "CSE11108", faculty: "Mr. Victor Das", location: "AU6-LH-201", type: "lecture" },
    { period: 4, subject: "Community Service", subjectCode: "SOC14100", faculty: "Faculty", location: "Auditorium", type: "activity" },
    { period: 6, subject: "Programming Language Lab", subjectCode: "CSE12106", faculty: "Dr. Arnab Sinha", location: "AU6-LAB-2102", type: "lab" },
    { period: 8, subject: "Switching Circuits & Logic Design", subjectCode: "CSE11105", faculty: "Dr. Shukla Banik", location: "AU6-LH-201", type: "lecture" },
  ],
  Wednesday: [
    { period: 1, subject: "Data Structures and Algorithms", subjectCode: "CSE11104", faculty: "Mr. Subhra Prokash Dutta", location: "AU6-LH-201", type: "lecture" },
    { period: 3, subject: "Data Structures and Algorithms", subjectCode: "CSE11104", faculty: "Mr. Subhra Prokash Dutta", location: "AU6-LH-201", type: "lecture" },
    { period: 4, subject: "Engineering Mathematics - III C", subjectCode: "SDS11510", faculty: "Faculty", location: "AU6-LH-201", type: "lecture" },
    { period: 6, subject: "Library Session", subjectCode: "", faculty: "", location: "Central Library", type: "library" },
    { period: 7, subject: "Data Structures Lab", subjectCode: "CSE12107", faculty: "Mr. Subhra Prokash Dutta", location: "AU6-LAB-2102", type: "lab" },
  ],
  Thursday: [
    { period: 1, subject: "Database Management Systems Lab", subjectCode: "CSE12113", faculty: "Mr. Victor Das", location: "AU6-LAB-4001B", type: "lab" },
    { period: 3, subject: "Switching Circuits & Logic Design", subjectCode: "CSE11105", faculty: "Dr. Shukla Banik", location: "AU6-LH-201", type: "lecture" },
    { period: 6, subject: "Engineering Mathematics - III C", subjectCode: "SDS11510", faculty: "Faculty", location: "AU6-LH-201", type: "lecture" },
  ],
  Friday: [
    { period: 1, subject: "Engineering Mathematics - III C", subjectCode: "SDS11510", faculty: "Faculty", location: "AU6-LH-201", type: "lecture" },
    { period: 2, subject: "Principles of Programming Language", subjectCode: "CSE11103", faculty: "Dr. Arnab Sinha", location: "AU6-LH-201", type: "lecture" },
    { period: 3, subject: "Interdisciplinary Project", subjectCode: "IDP14001", faculty: "Faculty", location: "AU6-LH-201", type: "activity" },
    { period: 4, subject: "Database Management Systems", subjectCode: "CSE11108", faculty: "Mr. Victor Das", location: "AU6-LH-201", type: "lecture" },
    { period: 6, subject: "Data Structures and Algorithms", subjectCode: "CSE11104", faculty: "Mr. Subhra Prokash Dutta", location: "AU6-LH-201", type: "lecture" },
  ],
};

DAYS.forEach((day) => {
  const entries = BASE_SCHEDULE[day] || [];
  entries.forEach((e) => {
    const timeInfo = PERIOD_TIMES.find((p) => p.period === e.period);
    MOCK_TIMETABLE.push({
      _id: `mock-tt-${day}-${e.period}`,
      day,
      period: e.period,
      startTime: timeInfo?.startTime || "09:30",
      endTime: timeInfo?.endTime || "10:25",
      subject: e.subject,
      subjectCode: e.subjectCode,
      faculty: e.faculty,
      location: e.location,
      type: e.type,
      section: "CSE-III-E",
      semester: 3,
    });
  });
});

// 5. In-Memory Recorded Attendance Store
export const MOCK_ATTENDANCE_RECORDS: any[] = [];

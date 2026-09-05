import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/attendify";

const userSchema = new mongoose.Schema({
  name: String, email: String, passwordHash: String,
  role: { type: String, enum: ["CR", "STUDENT", "ADMIN"] },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },
}, { timestamps: true });

const studentSchema = new mongoose.Schema({
  rollNumber: String, name: String, email: String,
  department: String, semester: Number, section: String, active: Boolean,
}, { timestamps: true });

const timetableSchema = new mongoose.Schema({
  day: String, period: Number, startTime: String, endTime: String,
  subject: String, subjectCode: String, faculty: String, location: String,
  type: { type: String, enum: ["lecture", "lab", "library", "activity", "free"] },
  section: String, semester: Number,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
const Timetable = mongoose.models.Timetable || mongoose.model("Timetable", timetableSchema);

const periods = [
  { period: 1, startTime: "09:30", endTime: "10:25" },
  { period: 2, startTime: "10:30", endTime: "11:25" },
  { period: 3, startTime: "11:30", endTime: "12:25" },
  { period: 4, startTime: "12:30", endTime: "13:25" },
  { period: 5, startTime: "13:30", endTime: "14:25" },
  { period: 6, startTime: "14:30", endTime: "15:25" },
  { period: 7, startTime: "15:30", endTime: "16:25" },
  { period: 8, startTime: "16:30", endTime: "17:25" },
];

const timetable = [
  // Monday
  { day: "Monday", period: 1, subject: "Database Management Systems", subjectCode: "CSE1108", faculty: "Mr. Victor Das", location: "", type: "lecture" },
  { day: "Monday", period: 2, subject: "Principles of Programming Language", subjectCode: "CSE1103", faculty: "Dr. Arnab Sinha", location: "", type: "lecture" },
  { day: "Monday", period: 3, subject: "Interdisciplinary Project", subjectCode: "IDP14001", faculty: "", location: "", type: "activity" },
  { day: "Monday", period: 4, subject: "Library", subjectCode: "", faculty: "", location: "Library", type: "library" },
  { day: "Monday", period: 6, subject: "Switching Circuits and Logic Design", subjectCode: "CSE1105", faculty: "Dr. Shukla Banik", location: "", type: "lecture" },
  { day: "Monday", period: 7, subject: "Engineering Mathematics - III C", subjectCode: "SDS11510", faculty: "", location: "", type: "lecture" },

  // Tuesday
  { day: "Tuesday", period: 1, subject: "Principles of Programming Language", subjectCode: "CSE1103", faculty: "Dr. Arnab Sinha", location: "", type: "lecture" },
  { day: "Tuesday", period: 2, subject: "Soft Skill (Non-NEP)", subjectCode: "CLL1 G3_3", faculty: "", location: "", type: "activity" },
  { day: "Tuesday", period: 3, subject: "Database Management Systems", subjectCode: "CSE1108", faculty: "Mr. Victor Das", location: "", type: "lecture" },
  { day: "Tuesday", period: 4, subject: "Community Service", subjectCode: "SOC14100", faculty: "", location: "", type: "activity" },
  { day: "Tuesday", period: 6, subject: "Principles of Programming Language Lab", subjectCode: "CSE12106", faculty: "Dr. Arnab Sinha / Mr. Sujoy Chatterjee", location: "AU6-LAB-2102", type: "lab" },
  { day: "Tuesday", period: 8, subject: "Switching Circuits and Logic Design", subjectCode: "CSE1105", faculty: "Dr. Shukla Banik", location: "AU6-LAB-2102", type: "lab" },

  // Wednesday
  { day: "Wednesday", period: 1, subject: "Data Structures and Algorithms", subjectCode: "CSE1104", faculty: "Mr. Subhra Prokash Dutta", location: "", type: "lecture" },
  { day: "Wednesday", period: 2, subject: "Interdisciplinary Project", subjectCode: "IDP14001", faculty: "", location: "", type: "activity" },
  { day: "Wednesday", period: 3, subject: "Data Structures and Algorithms", subjectCode: "CSE1104", faculty: "Mr. Subhra Prokash Dutta", location: "", type: "lecture" },
  { day: "Wednesday", period: 4, subject: "Engineering Mathematics - III C", subjectCode: "SDS11510", faculty: "", location: "", type: "lecture" },
  { day: "Wednesday", period: 6, subject: "Library", subjectCode: "", faculty: "", location: "Library", type: "library" },
  { day: "Wednesday", period: 7, subject: "Data Structures and Algorithms Lab", subjectCode: "CSE12107", faculty: "Mr. Subhra Prokash Dutta / Mr. Sujoy Chatterjee", location: "AU6-LAB-2102", type: "lab" },

  // Thursday
  { day: "Thursday", period: 1, subject: "Database Management Systems Lab", subjectCode: "CSE12113", faculty: "Mr. Victor Das / Ayan Mishra", location: "AU6-LAB-4001B", type: "lab" },
  { day: "Thursday", period: 2, subject: "Aptitude (Non-NEP)", subjectCode: "CLL2 G3_3", faculty: "", location: "", type: "activity" },
  { day: "Thursday", period: 3, subject: "Switching Circuits and Logic Design", subjectCode: "CSE1105", faculty: "Dr. Shukla Banik", location: "", type: "lecture" },
  { day: "Thursday", period: 6, subject: "Engineering Mathematics - III C", subjectCode: "SDS11510", faculty: "", location: "", type: "lecture" },

  // Friday
  { day: "Friday", period: 1, subject: "Engineering Mathematics - III C", subjectCode: "SDS11510", faculty: "", location: "", type: "lecture" },
  { day: "Friday", period: 2, subject: "Principles of Programming Language", subjectCode: "CSE1103", faculty: "Dr. Arnab Sinha", location: "", type: "lecture" },
  { day: "Friday", period: 3, subject: "Interdisciplinary Project", subjectCode: "IDP14001", faculty: "", location: "", type: "activity" },
  { day: "Friday", period: 4, subject: "Database Management Systems", subjectCode: "CSE1108", faculty: "Mr. Victor Das", location: "", type: "lecture" },
  { day: "Friday", period: 6, subject: "Data Structures and Algorithms", subjectCode: "CSE1104", faculty: "Mr. Subhra Prokash Dutta", location: "", type: "lecture" },
];

const students = [
  { rollNumber: "AU7-007-001", name: "Aarav Sharma", email: "aarav@attendify.com", department: "CSE", semester: 5, section: "E", active: true },
  { rollNumber: "AU7-007-002", name: "Riya Das", email: "riya@attendify.com", department: "CSE", semester: 5, section: "E", active: true },
  { rollNumber: "AU7-007-003", name: "Aditya Roy", email: "aditya@attendify.com", department: "CSE", semester: 5, section: "E", active: true },
  { rollNumber: "AU7-007-004", name: "Sneha Paul", email: "sneha@attendify.com", department: "CSE", semester: 5, section: "E", active: true },
  { rollNumber: "AU7-007-005", name: "Rahul Sen", email: "rahul@attendify.com", department: "CSE", semester: 5, section: "E", active: true },
  { rollNumber: "AU7-007-006", name: "Ananya Roy", email: "ananya@attendify.com", department: "CSE", semester: 5, section: "E", active: true },
  { rollNumber: "AU7-007-007", name: "Soham Das", email: "soham@attendify.com", department: "CSE", semester: 5, section: "E", active: true },
  { rollNumber: "AU7-007-008", name: "Priya Sharma", email: "priya@attendify.com", department: "CSE", semester: 5, section: "E", active: true },
];

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.\n");

  // Clear existing data
  await User.deleteMany({});
  await Student.deleteMany({});
  await Timetable.deleteMany({});
  console.log("Cleared existing data.");

  // Hash passwords
  const hash = async (pw: string) => bcrypt.hash(pw, 10);

  // Create users
  const adminUser = await User.create({
    name: "Admin User", email: "admin@attendify.com",
    passwordHash: await hash("admin123"), role: "ADMIN",
  });
  console.log("Created admin: admin@attendify.com / admin123");

  const crUser = await User.create({
    name: "Debadrita Goswami", email: "deba@attendify.com",
    passwordHash: await hash("deba123"), role: "CR",
  });
  console.log("Created CR: deba@attendify.com / deba123");

  const studentUser = await User.create({
    name: "Aarav Sharma", email: "stu@attendify.com",
    passwordHash: await hash("stu123"), role: "STUDENT",
  });
  console.log("Created student: stu@attendify.com / stu123");

  // Create students
  const createdStudents = await Student.insertMany(students);
  console.log(`Created ${createdStudents.length} students.`);

  // Link student user to student record
  await User.findByIdAndUpdate(studentUser._id, { studentId: createdStudents[0]._id });
  console.log("Linked student user to Aarav Sharma.");

  // Create timetable
  const timetableEntries = timetable.map(entry => ({
    ...entry,
    section: "CSE-III-E",
    semester: 5,
  }));
  await Timetable.insertMany(timetableEntries);
  console.log(`Created ${timetableEntries.length} timetable entries.`);

  console.log("\nSeed complete!");
  console.log("\nLogin credentials:");
  console.log("  ADMIN:  admin@attendify.com / admin123");
  console.log("  CR:     deba@attendify.com / deba123");
  console.log("  STUDENT: stu@attendify.com / stu123");

  await mongoose.disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });

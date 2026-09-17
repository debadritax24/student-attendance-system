import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const rawUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/attendify";
// If the URI already contains a database path (e.g. /attendify), use it as-is.
// For Atlas URIs like mongodb+srv://...@cluster.mongodb.net/dbname?opts,
// strip the database and append /attendify.
const MONGODB_URI = (() => {
  try {
    const url = new URL(rawUri);
    // If path is just "/" or empty, append /attendify
    if (!url.pathname || url.pathname === "/") {
      url.pathname = "/attendify";
      return url.toString();
    }
    return rawUri;
  } catch {
    // Local URIs (mongodb://127.0.0.1:27017) — use as-is
    return rawUri;
  }
})();

const userSchema = new mongoose.Schema({
  name: String, email: String, passwordHash: String,
  role: { type: String, enum: ["CR", "STUDENT", "ADMIN"] },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },
}, { timestamps: true });

const studentSchema = new mongoose.Schema({
  rollNumber: String, enrollmentNumber: String, name: String, email: String,
  department: String, semester: Number, section: String, active: Boolean,
}, { timestamps: true });

const subjectSchema = new mongoose.Schema({
  code: String, name: String, department: String, semester: Number, section: String,
}, { timestamps: true });

const timetableSchema = new mongoose.Schema({
  day: String, period: Number, startTime: String, endTime: String,
  subject: String, subjectCode: String, faculty: String, location: String,
  type: { type: String, enum: ["lecture", "lab", "library", "activity", "free"] },
  section: String, semester: Number,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
const Subject = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);
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

const cseTimetable = [
  // Monday
  { day: "Monday", period: 1, subject: "Database Management Systems", subjectCode: "CSE11108", faculty: "Mr. Victor Das", location: "", type: "lecture" },
  { day: "Monday", period: 2, subject: "Professional Core – I Principles of Programming Language", subjectCode: "CSE11103", faculty: "Dr. Arnab Sinha", location: "", type: "lecture" },
  { day: "Monday", period: 3, subject: "Interdisciplinary Project", subjectCode: "IDP14001", faculty: "", location: "", type: "activity" },
  { day: "Monday", period: 4, subject: "Library", subjectCode: "", faculty: "", location: "Library", type: "library" },
  { day: "Monday", period: 6, subject: "Professional Core – III Switching Circuits and Logic Design", subjectCode: "CSE11105", faculty: "Dr. Shukla Banik", location: "", type: "lecture" },
  { day: "Monday", period: 7, subject: "Engineering Mathematics - III C", subjectCode: "SDS11510", faculty: "", location: "", type: "lecture" },

  // Tuesday
  { day: "Tuesday", period: 1, subject: "Professional Core – I Principles of Programming Language", subjectCode: "CSE11103", faculty: "Dr. Arnab Sinha", location: "", type: "lecture" },
  { day: "Tuesday", period: 2, subject: "CLL1 G3_3 (Soft Skill-Non-NEP)", subjectCode: "CLL1 G3_3", faculty: "", location: "", type: "activity" },
  { day: "Tuesday", period: 3, subject: "Database Management Systems", subjectCode: "CSE11108", faculty: "Mr. Victor Das", location: "", type: "lecture" },
  { day: "Tuesday", period: 4, subject: "Community Service", subjectCode: "SOC14100", faculty: "", location: "", type: "activity" },
  { day: "Tuesday", period: 6, subject: "Professional Core Lab – I Principles of Programming Language Lab", subjectCode: "CSE12106", faculty: "Dr. Arnab Sinha / Mr. Sujoy Chatterjee", location: "AU6-LAB-2102", type: "lab" },
  { day: "Tuesday", period: 8, subject: "Professional Core – III Switching Circuits and Logic Design", subjectCode: "CSE11105", faculty: "Dr. Shukla Banik", location: "", type: "lecture" },

  // Wednesday
  { day: "Wednesday", period: 1, subject: "Professional Core – II Data Structures and Algorithms", subjectCode: "CSE11104", faculty: "Mr. Subhra Prokash Dutta", location: "", type: "lecture" },
  { day: "Wednesday", period: 2, subject: "Interdisciplinary Project", subjectCode: "IDP14001", faculty: "", location: "", type: "activity" },
  { day: "Wednesday", period: 3, subject: "Professional Core – II Data Structures and Algorithms", subjectCode: "CSE11104", faculty: "Mr. Subhra Prokash Dutta", location: "", type: "lecture" },
  { day: "Wednesday", period: 4, subject: "Engineering Mathematics - III C", subjectCode: "SDS11510", faculty: "", location: "", type: "lecture" },
  { day: "Wednesday", period: 6, subject: "Library", subjectCode: "", faculty: "", location: "Library", type: "library" },
  { day: "Wednesday", period: 7, subject: "Professional Core Lab - II Data Structures and Algorithms Lab", subjectCode: "CSE12107", faculty: "Mr. Subhra Prokash Dutta / Mr. Sujoy Chatterjee", location: "AU6-LAB-2102", type: "lab" },

  // Thursday
  { day: "Thursday", period: 1, subject: "Database Management Systems Lab", subjectCode: "CSE12113", faculty: "Mr. Victor Das / Ayan Mishra", location: "AU6-LAB-4001B", type: "lab" },
  { day: "Thursday", period: 2, subject: "CLL2 G3_3 (Aptitude-Non-NEP)", subjectCode: "CLL2 G3_3", faculty: "", location: "", type: "activity" },
  { day: "Thursday", period: 3, subject: "Professional Core – III Switching Circuits and Logic Design", subjectCode: "CSE11105", faculty: "Dr. Shukla Banik", location: "", type: "lecture" },
  { day: "Thursday", period: 6, subject: "Engineering Mathematics - III C", subjectCode: "SDS11510", faculty: "", location: "", type: "lecture" },

  // Friday
  { day: "Friday", period: 1, subject: "Engineering Mathematics - III C", subjectCode: "SDS11510", faculty: "", location: "", type: "lecture" },
  { day: "Friday", period: 2, subject: "Professional Core – I Principles of Programming Language", subjectCode: "CSE11103", faculty: "Dr. Arnab Sinha", location: "", type: "lecture" },
  { day: "Friday", period: 3, subject: "Interdisciplinary Project", subjectCode: "IDP14001", faculty: "", location: "", type: "activity" },
  { day: "Friday", period: 4, subject: "Database Management Systems", subjectCode: "CSE11108", faculty: "Mr. Victor Das", location: "", type: "lecture" },
  { day: "Friday", period: 6, subject: "Professional Core – II Data Structures and Algorithms", subjectCode: "CSE11104", faculty: "Mr. Subhra Prokash Dutta", location: "", type: "lecture" },
];

const sections = [
  { key: "CSE-III-A", department: "CSE", semester: 3, section: "A" },
  { key: "CSE-III-B", department: "CSE", semester: 3, section: "B" },
  { key: "CSE-III-C", department: "CSE", semester: 3, section: "C" },
  { key: "CSE-III-D", department: "CSE", semester: 3, section: "D" },
  { key: "CSE-III-E", department: "CSE", semester: 3, section: "E" },
  { key: "CSE-V-A", department: "CSE", semester: 5, section: "A" },
  { key: "CSE-V-B", department: "CSE", semester: 5, section: "B" },
  { key: "CSE-V-C", department: "CSE", semester: 5, section: "C" },
  { key: "CSE-V-D", department: "CSE", semester: 5, section: "D" },
  { key: "CSE-V-E", department: "CSE", semester: 5, section: "E" },
  { key: "IT-III-A", department: "IT", semester: 3, section: "A" },
  { key: "IT-III-B", department: "IT", semester: 3, section: "B" },
  { key: "IT-V-A", department: "IT", semester: 5, section: "A" },
  { key: "IT-V-B", department: "IT", semester: 5, section: "B" },
  { key: "ECE-III-A", department: "ECE", semester: 3, section: "A" },
  { key: "ECE-III-B", department: "ECE", semester: 3, section: "B" },
  { key: "ECE-V-A", department: "ECE", semester: 5, section: "A" },
  { key: "ECE-V-B", department: "ECE", semester: 5, section: "B" },
  { key: "EEE-III-A", department: "EEE", semester: 3, section: "A" },
  { key: "EEE-III-B", department: "EEE", semester: 3, section: "B" },
  { key: "ME-III-A", department: "ME", semester: 3, section: "A" },
  { key: "ME-III-B", department: "ME", semester: 3, section: "B" },
  { key: "CE-III-A", department: "CE", semester: 3, section: "A" },
  { key: "CE-III-B", department: "CE", semester: 3, section: "B" },
];

const students = [
  { rollNumber: "UG/04/BT/CSE/2025/281", enrollmentNumber: "AU/2025/002974", name: "Ayan Mondal", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/282", enrollmentNumber: "AU/2025/002981", name: "Monalisa Panda", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/286", enrollmentNumber: "AU/2025/002996", name: "Ankita Jana", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/287", enrollmentNumber: "AU/2025/003017", name: "Nilanjana Sarkar", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/289", enrollmentNumber: "AU/2025/003022", name: "Sunandan Ghosh", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/290", enrollmentNumber: "AU/2025/003025", name: "Sk Sahil Ahmed", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/291", enrollmentNumber: "AU/2025/003045", name: "Samayan Roy", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/292", enrollmentNumber: "AU/2025/003049", name: "Tamanna Bisiwas", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/293", enrollmentNumber: "AU/2025/003057", name: "Dipon Das", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/294", enrollmentNumber: "AU/2025/003103", name: "Subhadeep dutta", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/295", enrollmentNumber: "AU/2025/003109", name: "Saptartimi Saha", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/296", enrollmentNumber: "AU/2025/003111", name: "Priyangshu Paul", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/297", enrollmentNumber: "AU/2025/003117", name: "Aryan Pandey", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/298", enrollmentNumber: "AU/2025/003209", name: "Kishaloy Mondal", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/300", enrollmentNumber: "AU/2025/003248", name: "Reyansh Dalui", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/301", enrollmentNumber: "AU/2025/003277", name: "Srisyaditya Bose", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/302", enrollmentNumber: "AU/2025/003286", name: "Mohit Saha", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/303", enrollmentNumber: "AU/2025/003287", name: "Aaditya Mallick", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/304", enrollmentNumber: "AU/2025/003300", name: "Talha Talwekar", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/306", enrollmentNumber: "AU/2025/003378", name: "Neha Adhikari", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/307", enrollmentNumber: "AU/2025/003380", name: "Nilanilina Dutta", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/308", enrollmentNumber: "AU/2025/003381", name: "Sukriti Biswas", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/309", enrollmentNumber: "AU/2025/003390", name: "Satyam Kumar", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/310", enrollmentNumber: "AU/2025/003488", name: "Ashik Mondal", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/312", enrollmentNumber: "AU/2025/003490", name: "Partho Majumder", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/313", enrollmentNumber: "AU/2025/003511", name: "Subhajit Daripa", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/314", enrollmentNumber: "AU/2025/003521", name: "Shaunk Shah", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/315", enrollmentNumber: "AU/2025/003522", name: "Thangam Borish Meitei", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/316", enrollmentNumber: "AU/2025/003567", name: "Sourangshu Mallick", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/317", enrollmentNumber: "AU/2025/003570", name: "Shubynyuti Dhar", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/318", enrollmentNumber: "AU/2025/003586", name: "Rajbir Saha", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/319", enrollmentNumber: "AU/2025/003588", name: "Abdul Matin", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/320", enrollmentNumber: "AU/2025/003593", name: "Anshankhan Mandal", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/321", enrollmentNumber: "AU/2025/003595", name: "Ankit Yadav", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/322", enrollmentNumber: "AU/2025/003596", name: "Harsh Ray", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/323", enrollmentNumber: "AU/2025/003639", name: "Surajit Dey", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/324", enrollmentNumber: "AU/2025/003640", name: "Kusumita Mondal", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/325", enrollmentNumber: "AU/2025/003641", name: "Ranit Samui", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/326", enrollmentNumber: "AU/2025/003647", name: "Shilpa Sahoo", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/327", enrollmentNumber: "AU/2025/003650", name: "Shirshendu Ghosh", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/328", enrollmentNumber: "AU/2025/003713", name: "Tuhin Majumdar", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/330", enrollmentNumber: "AU/2025/003731", name: "Rimi Saha", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/331", enrollmentNumber: "AU/2025/003735", name: "Shreyasree Ghosh Mondal", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/332", enrollmentNumber: "AU/2025/003739", name: "Pramit Mukherjee", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/333", enrollmentNumber: "AU/2025/003743", name: "Ankhi Biswas", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/334", enrollmentNumber: "AU/2025/003745", name: "Sayak Biswas", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/335", enrollmentNumber: "AU/2025/003746", name: "Aditi Palit", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/336", enrollmentNumber: "AU/2025/003749", name: "Ramanda Dinda", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/337", enrollmentNumber: "AU/2025/003751", name: "Banhita Chakraborty", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/338", enrollmentNumber: "AU/2025/003814", name: "Soumidip Chakraborty", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/339", enrollmentNumber: "AU/2025/003844", name: "Debadrita Goswami", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/340", enrollmentNumber: "AU/2025/003847", name: "Ayush Biswas", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/341", enrollmentNumber: "AU/2025/003851", name: "Mangaldeep Mondal", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/342", enrollmentNumber: "AU/2025/003914", name: "Sattvik Tarafadar", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/343", enrollmentNumber: "AU/2025/003161", name: "Sovik Sahoo", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/345", enrollmentNumber: "AU/2025/002064", name: "Sourajitr Chakraborty", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/346", enrollmentNumber: "AU/2025/001911", name: "Saptarshi Mandal", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/347", enrollmentNumber: "AU/2025/002384", name: "Suchana Pal", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/348", enrollmentNumber: "AU/2025/003917", name: "Abhilbika Sarkar", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/349", enrollmentNumber: "AU/2025/003932", name: "Namrata Chauhan", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
  { rollNumber: "UG/04/BT/CSE/2025/350", enrollmentNumber: "AU/2025/004034", name: "Saswata Das", department: "CSE", semester: 3, section: "CSE-III-E", active: true },
];

const subjects = [
  { code: "CSE11103", name: "Professional Core – I Principles of Programming Language", department: "CSE", semester: 3, section: "E" },
  { code: "CSE11104", name: "Professional Core – II Data Structures and Algorithms", department: "CSE", semester: 3, section: "E" },
  { code: "CSE11105", name: "Professional Core – III Switching Circuits and Logic Design", department: "CSE", semester: 3, section: "E" },
  { code: "CSE11108", name: "Database Management Systems", department: "CSE", semester: 3, section: "E" },
  { code: "SDS11510", name: "Engineering Mathematics - III C", department: "CSE", semester: 3, section: "E" },
  { code: "IDP14001", name: "Interdisciplinary Project", department: "CSE", semester: 3, section: "E" },
  { code: "SOC14100", name: "Community Service", department: "CSE", semester: 3, section: "E" },
  { code: "CLL1 G3_3", name: "CLL1 G3_3 (Soft Skill-Non-NEP)", department: "CSE", semester: 3, section: "E" },
  { code: "CLL2 G3_3", name: "CLL2 G3_3 (Aptitude-Non-NEP)", department: "CSE", semester: 3, section: "E" },
  { code: "CSE12106", name: "Professional Core Lab – I Principles of Programming Language Lab", department: "CSE", semester: 3, section: "E" },
  { code: "CSE12107", name: "Professional Core Lab - II Data Structures and Algorithms Lab", department: "CSE", semester: 3, section: "E" },
  { code: "CSE12113", name: "Database Management Systems Lab", department: "CSE", semester: 3, section: "E" },
];

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.\n");

  // Clear existing data
  await User.deleteMany({});
  await Student.deleteMany({});
  await Subject.deleteMany({});
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
    name: "Debadrita Goswami", email: "stu@attendify.com",
    passwordHash: await hash("stu123"), role: "STUDENT",
  });
  console.log("Created student: stu@attendify.com / stu123");

  // Create students
  const createdStudents = await Student.insertMany(students);
  console.log(`Created ${createdStudents.length} students.`);

  // Link student user to student record (Debadrita Goswami)
  const debadrita = createdStudents.find(s => s.name === "Debadrita Goswami");
  if (debadrita) {
    await User.findByIdAndUpdate(studentUser._id, { studentId: debadrita._id });
    console.log("Linked student user to Debadrita Goswami.");
  }

  // Create subjects
  await Subject.insertMany(subjects);
  console.log(`Created ${subjects.length} subjects.`);

  // Create timetable entries for all sections
  const allTimetableEntries: any[] = [];
  for (const sec of sections) {
    const entries = cseTimetable.map(entry => ({
      ...entry,
      startTime: periods[entry.period - 1].startTime,
      endTime: periods[entry.period - 1].endTime,
      section: sec.key,
      semester: sec.semester,
    }));
    allTimetableEntries.push(...entries);
  }
  await Timetable.insertMany(allTimetableEntries);
  console.log(`Created ${allTimetableEntries.length} timetable entries across ${sections.length} sections.`);

  console.log("\nSeed complete!");
  console.log("\nLogin credentials:");
  console.log("  ADMIN:  admin@attendify.com / admin123");
  console.log("  CR:     deba@attendify.com / deba123");
  console.log("  STUDENT: stu@attendify.com / stu123");

  await mongoose.disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });

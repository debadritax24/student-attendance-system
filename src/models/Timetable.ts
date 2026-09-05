import mongoose, { Schema } from "mongoose";

const timetableSchema = new Schema({
  day: { type: String, required: true, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
  period: { type: Number, required: true, min: 1, max: 8 },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  subject: { type: String, default: "" },
  subjectCode: { type: String, default: "" },
  faculty: { type: String, default: "" },
  location: { type: String, default: "" },
  type: { type: String, enum: ["lecture", "lab", "library", "activity", "free"], default: "lecture" },
  section: { type: String, default: "CSE-III-E" },
  semester: { type: Number, default: 5 },
}, { timestamps: true });

timetableSchema.index({ day: 1, period: 1, section: 1 });

export default mongoose.models.Timetable || mongoose.model("Timetable", timetableSchema);

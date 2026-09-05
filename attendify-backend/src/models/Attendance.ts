import mongoose, { Schema } from "mongoose";
const schema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true, index: true },
  subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true, index: true },
  date: { type: Date, required: true, index: true },
  status: { type: String, enum: ["PRESENT","ABSENT","LATE"], required: true },
  markedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  note: { type: String, maxlength: 500 }
}, { timestamps: true });
schema.index({ student: 1, subject: 1, date: 1 }, { unique: true });
export default mongoose.models.Attendance || mongoose.model("Attendance", schema);
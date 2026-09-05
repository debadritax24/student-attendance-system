import mongoose, { Schema } from "mongoose";
const schema = new Schema({
  rollNumber: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true, index: true },
  email: { type: String, trim: true, lowercase: true },
  department: { type: String, index: true },
  semester: { type: Number, min: 1, max: 20 },
  section: { type: String, index: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.models.Student || mongoose.model("Student", schema);
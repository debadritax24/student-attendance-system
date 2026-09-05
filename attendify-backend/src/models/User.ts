import mongoose, { Schema } from "mongoose";
const schema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["CR","STUDENT","ADMIN"], required: true, index: true },
  studentId: { type: Schema.Types.ObjectId, ref: "Student", default: null }
}, { timestamps: true });
export default mongoose.models.User || mongoose.model("User", schema);
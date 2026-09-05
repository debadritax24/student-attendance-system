import mongoose, { Schema } from "mongoose";
const schema = new Schema({
  code: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  department: String,
  semester: Number,
  section: String,
  createdBy: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });
export default mongoose.models.Subject || mongoose.model("Subject", schema);
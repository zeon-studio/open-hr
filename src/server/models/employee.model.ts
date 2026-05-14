import mongoose, { Schema } from "mongoose";

const EmployeeSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: "" },
    image: { type: String, default: "" },
    photo_source: { type: String, default: null },
    work_email: { type: String, default: "", index: true },
    password: { type: String, select: false },
    personal_email: { type: String, default: "" },
    communication_id: { type: String, default: "" },
    department: { type: String, default: "" },
    designation: { type: String, default: "" },
    role: { type: String, default: "user", index: true },
    status: { type: String, default: "pending", index: true },
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    strict: false,
  },
);

export const Employee =
  mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);

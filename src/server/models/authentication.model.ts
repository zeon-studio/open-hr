import mongoose, { Schema } from "mongoose";

const AuthenticationSchema = new Schema(
  {
    user_id: { type: String, required: true, unique: true, index: true },
    pass_reset_token: {
      token: { type: String },
      expires: { type: String },
    },
  },
  {
    timestamps: true,
    strict: false,
  },
);

export const Authentication =
  mongoose.models.Authentication ||
  mongoose.model("Authentication", AuthenticationSchema);

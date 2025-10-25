import mongoose from "mongoose";
import bcypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    bio: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.validatePassword = async function (password) {
  try {
    return await bcypt.compare(password.toString(), this.password);
  } catch (error) {
    return false;
  }
};

export const User = mongoose.model("User", userSchema);

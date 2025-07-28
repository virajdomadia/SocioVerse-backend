import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["Admin", "Verified", "Regular"],
      default: "Regular",
    },
    avatar: {
      type: String,
      default: "https://example.com/default-avatar.png",
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    coverPhoto: {
      type: String,
      default: "https://example.com/default-cover-photo.png",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);

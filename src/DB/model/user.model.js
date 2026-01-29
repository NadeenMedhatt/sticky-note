import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name Is Required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email Is Required"],
    },
    password: {
      type: String,
      required: [true, "Password Is Required"],
    },
    phone: {
      type: String,
      required: [true, "Phone Is Required"],
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
    },
  },
  {
    collection: "USERS",
    strict: true,
    timestamps: true,
    autoIndex: true,
    validateBeforeSave: true,
  },
);

export const UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);

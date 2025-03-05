import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin"; // Add the role field
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"], // Define allowed roles
    default: "user", // Default role is "user"
  },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
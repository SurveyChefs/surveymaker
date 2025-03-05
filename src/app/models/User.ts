import mongoose, { Document, Schema } from "mongoose";

// Define the user interface that extends from mongoose's Document type
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";  // Add the role field
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
    enum: ["user", "admin"],  // Only allow "user" or "admin" as role values
    default: "user",  // Default to "user" for new users
  },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

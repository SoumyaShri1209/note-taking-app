
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();

    console.log("Incoming reset request:", { token, newPassword });

    if (!token || !newPassword) {
      console.log(" Missing token or password");
      return new Response(JSON.stringify({ error: "Token and new password are required" }), { status: 400 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(" Token decoded:", decoded);
    } catch (err) {
      console.log(" JWT verification failed:", err.message);
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 400 });
    }

    const user = await User.findOne({
      _id: decoded.id,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    console.log(" User found:", user ? user.email : "No user");

    if (!user) {
      console.log("No matching user or token expired");
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 400 });
    }

   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    console.log(" New hashed password:", hashedPassword);

    user.password = hashedPassword;

   
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;

    await user.save({ validateBeforeSave: false });
 

    return new Response(
      JSON.stringify({ message: "Password reset successfully", success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.log(" Server error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

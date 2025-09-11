



// /api/user/signup.js
import { connect } from "@/dbConfig/dbConfig.js";
import User from "@/models/userModel.js";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "@/helpers/mailer.js";

connect();

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verifyToken,
      verifyTokenExpiry: Date.now() + 3600000,
    });

    const savedUser = await newUser.save();

    // send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id, token: verifyToken });

    return NextResponse.json({
      message: "User created successfully. Please verify your email.",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

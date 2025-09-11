







import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";
import jwt from "jsonwebtoken";

connect();

export async function POST(request) {
  try {
    const { email } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Save token + expiry in DB
    user.forgotPasswordToken = token;
    user.forgotPasswordTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email with link
    await sendEmail({ email: user.email, emailType: "RESET", userId: user._id, token });

    return new Response(JSON.stringify({ message: "Reset email sent" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}


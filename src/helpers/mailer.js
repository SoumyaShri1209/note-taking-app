
import nodemailer from "nodemailer";
import User from "@/models/userModel.js";

export const sendEmail = async ({ email, emailType, userId, token }) => {
  try {
    // Save token in DB
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: token,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Generate link based on email type
    const link =
      emailType === "VERIFY"
        ? `${process.env.DOMAIN}/verifyemail?token=${encodeURIComponent(token)}`
        : `${process.env.DOMAIN}/resetPassword?token=${encodeURIComponent(token)}`;

    const mailOptions = {
      from: "soumya12shri@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY"
          ? "Verify your email"
          : "Reset your password",
      html: `<p>Click <a href="${link}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }.</p>`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    throw new Error(error.message);
  }
};

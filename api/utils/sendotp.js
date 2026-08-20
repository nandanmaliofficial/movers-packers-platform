import dotenv from "dotenv";
dotenv.config();
import nodemailer from 'nodemailer';

const sendOTP = async (email, otp) => {
   // transporter code
  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP CONNECTION ERROR:", error);
  } else {
    console.log("SMTP SERVER READY:", success);
  }
});

await transporter.sendMail({
  from: process.env.EMAIL_ID,
  to: email,
  subject: "Email Verification OTP",
  html: `
    <h2>Verify Your Account</h2>
    <p>Your OTP is:</p>
    <h1>${otp}</h1>
    <p>Valid for 10 minutes.</p>
  `
});
};

export default sendOTP;
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Movers & Packers <onboarding@resend.dev>",
      to: [email],
      subject: "Email Verification OTP",
      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
        ">
          <h2 style="margin-bottom: 20px;">
            Verify Your Account
          </h2>

          <p>Your OTP for email verification is:</p>

          <h1 style="
            letter-spacing: 8px;
            font-size: 32px;
            margin: 20px 0;
          ">
            ${otp}
          </h1>

          <p>
            This OTP is valid for <strong>10 minutes</strong>.
          </p>

          <p style="color: #666;">
            If you did not request this OTP, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("RESEND EMAIL ERROR:", error);

      throw new Error(error.message || "Failed to send OTP email");
    }

    console.log("OTP EMAIL SENT SUCCESSFULLY:", data?.id);

    return data;
  } catch (error) {
    console.error("SEND OTP ERROR:", error);

    throw error;
  }
};

export default sendOTP;
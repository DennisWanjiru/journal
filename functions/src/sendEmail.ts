import * as nodemailer from "nodemailer";
import "dotenv";

export type Options = {
  to: string;
  text: string;
};

const sendEmail = async (mailOptions: Options) => {
  try {
    // Set up Nodemailer transporter with your SMTP configuration
    const mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    // Send the email
    await mailTransporter.sendMail({
      from: process.env.SENDER_EMAIL,
      subject: "Journal from a fellow journaler",
      ...mailOptions,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendEmail;

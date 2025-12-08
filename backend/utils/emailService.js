import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer"

const transporter=nodemailer.createTransport(
    {
        service:"gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    }
);

export const sendEmail = async ({to,subject,html}) =>{
    try {
        await transporter.sendMail({
            from: `"MNIT Course Registration" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log("✅ Email Sent to:", to);
    } catch (err) {
        console.log("❌ Email Error:", err);
        throw new Error("Could not send email");
    }
}
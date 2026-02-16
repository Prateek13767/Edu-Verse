import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const CHIEF_WARDEN_EMAIL = process.env.CHIEF_WARDEN_EMAIL;
const CHIEF_WARDEN_PASSWORD = process.env.CHIEF_WARDEN_PASSWORD;
const CHIEF_WARDEN_JWT_SECRET = process.env.CHIEF_WARDEN_JWT_SECRET;

export const chiefWardenLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required",
            });
        }

        if (email !== CHIEF_WARDEN_EMAIL) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email",
            });
        }

        if (password !== CHIEF_WARDEN_PASSWORD) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password",
            });
        }

        const token = jwt.sign(
            { role: "chiefWarden", email: CHIEF_WARDEN_EMAIL },
            CHIEF_WARDEN_JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            success: true,
            message: "Chief Warden login successful",
            token,
            chiefWarden: {
                email: CHIEF_WARDEN_EMAIL,
                role: "chiefWarden",
            },
        });
    } catch (err) {
        console.error("Chief Warden Login Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

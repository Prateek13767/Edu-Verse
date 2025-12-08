import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required",
            });
        }

        if (email !== ADMIN_EMAIL) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email",
            });
        }

        // Plain password compare (simple & works)
        if (password !== ADMIN_PASSWORD) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password",
            });
        }

        const token = jwt.sign(
            { role: "admin", email: ADMIN_EMAIL },
            ADMIN_JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            success: true,
            message: "Admin login successful",
            token,
            admin: {
                email: ADMIN_EMAIL,
                role: "admin",
            },
        });
    } catch (err) {
        console.error("Admin Login Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

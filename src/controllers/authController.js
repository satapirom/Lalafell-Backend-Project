import { hashPassword, comparePassword } from '../utils/hash.js';
import User from '../models/User.js';
import { sign } from '../utils/token.js';
import { verify } from '../utils/token.js';

// ลงทะเบียนผู้ใช้
const register = async (req, res) => {
    console.log(req.body); // ตรวจสอบค่าที่ส่งมาจาก frontend

    const { username, email, password, confirmPassword, termsAccepted } = req.body;

    if (!username || !email || !password || !confirmPassword || !termsAccepted) {
        return res.status(400).json({ error: true, message: "Please provide all required fields" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: true, message: "Passwords do not match" });
    }

    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(409).json({ error: true, message: "User already exists" });
        }

        const hashedPassword = await hashPassword(password);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword,
            termsAccepted,
            termsVersion: "1.0"
        });

        await user.save();

        const accessToken = sign({ userId: user._id });

        return res.status(201).json({
            error: false,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            accessToken,
            message: "User created successfully",
        });
    } catch (error) {
        console.error(`Error during registration: ${error.message}`);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};


// เข้าสู่ระบบ
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res
                .status(400)
                .json({ error: true, message: "Please provide username and password" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ error: true, message: "Invalid credentials" });
        }

        const accessToken = sign({ user: user._id });

        const { password: userPassword, ...userData } = user.toObject();

        res
            .status(200)
            .json({ message: "Login successful", data: userData, accessToken });

    } catch (error) {
        console.error(`Error during login: ${error.message}`);
        return res.status(500).json({
            error: true,
            message: `Internal Server Error: ${error.message}`,
        });
    }
};

const logout = (req, res) => {
    res.status(200).json({ message: "Logout successful" });
};

// ฟังก์ชันตรวจสอบการ authentication ตรวจสอบ สถานะการเข้าสู่ระบบ เช็คสิทธิ์
const checkAuth = (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: true, message: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verify(token); // ตรวจสอบ token
        return res.status(200).json({ error: false, message: "Authenticated", userId: decoded.userId });
    } catch (error) {
        return res.status(401).json({ error: true, message: "Invalid token" });
    }
};

export default {
    register,
    login,
    logout,
    checkAuth
};


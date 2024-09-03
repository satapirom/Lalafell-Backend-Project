import { hashPassword, comparePassword } from '../utils/hash.js';
import User from '../models/User.js';
import { sign } from '../utils/token.js';
import cloudinary from '../utils/cloudinary.js';

// ลงทะเบียนผู้ใช้
const register = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    const file = req.file;

    // Debugging logs
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", file);

    if (!username || !email || !password || !confirmPassword) {
        return res
            .status(400)
            .json({ error: true, message: "Please provide all required fields" });
    }

    try {
        const userExists = await User.findOne({ email, username });
        if (userExists) {
            return res
                .status(400)
                .json({ error: true, message: "User already exists" });
        }

        const hashedPassword = await hashPassword(password);

        let imgData = null;
        // Check if file is provided and upload to Cloudinary
        if (file) {
            console.log("Uploading file to Cloudinary...");
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "users",
            });
            imgData = {
                public_id: result.public_id,
                url: result.secure_url,
            };
            console.log("Uploaded file data:", imgData);
        } else {
            console.log("No file uploaded, skipping image upload step.");
        }

        const user = new User({
            username: username, // เปลี่ยนจาก name เป็น username ให้ตรงกับ model
            email: email,
            password: hashedPassword,
            confirmPassword: hashedPassword,
            img: imgData,
        });

        await user.save();
        console.log("User saved successfully!");

        const accessToken = sign({ user: user._id });

        return res.status(201).json({
            error: false,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                img: user.img,
            },
            accessToken,
            message: "User created successfully",
        });
    } catch (error) {
        console.error(`Error during registration: ${error.message}`);
        console.error(error); // เพิ่ม log error เต็มๆ
        return res
            .status(500)
            .json({ error: true, message: "Internal Server Error" });
    }
};

// เข้าสู่ระบบ
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: true, message: "Please provide email and password" });
        }

        const user = await User.findOne({ email });
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

export default {
    register,
    login
};


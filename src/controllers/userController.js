import User from '../models/User.js';
import cloudinary from '../utils/cloudinary.js';

const getUser = async (req, res) => {
    try {
        const users = await User.find();
        return res.json({ error: false, users });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

const getProfile = async (req, res) => {
    const user = req.user;
    try {
        return res.json({ error: false, myUser: user });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

const updateProfile = async (req, res) => {
    const user = req.user;
    const { username, email, password } = req.body;

    try {
        user.username = username;
        user.email = email;
        user.password = password;

        await user.save();

        return res.json({ error: false, myUser: user });
    } catch (error) {
        console.error(`profile update error: ${error.message}`);
        return res.status(500).json({ error: true, message: error.message });
    }
};

const uploadProfileImg = async (req, res) => {
    const user = req.user;

    try {
        const file = req.file;
        const result = await cloudinary.uploader.upload(file.path, {
            folder: "users",
        });
        user.img = result.secure_url;
        await user.save();
        return res.json({ error: false, myUser: user });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

const userController = {
    getUser,
    getProfile,
    updateProfile,
    uploadProfileImg
};

export default userController;


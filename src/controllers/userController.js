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
    const userId = req.user._id;  // ใช้ _id ของผู้ใช้ปัจจุบัน
    try {
        // ดึงข้อมูลผู้ใช้จากฐานข้อมูลโดยใช้ ID ของผู้ใช้
        const user = await User.findById(userId).select('username email profileImage coverImage'); // ดึงฟิลด์ที่ต้องการ

        if (!user) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        return res.json({ error: false, myUser: user });
    } catch (error) {
        console.error('Error fetching profile:', error);
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

const uploadProfileAndCoverImg = async (req, res) => {
    try {
        const userId = req.user._id;

        let profileImageResult = null;
        let coverImageResult = null;

        if (req.files.profileImage) {
            const profileImagePath = req.files.profileImage[0].path;
            profileImageResult = await cloudinary.uploader.upload(profileImagePath, {
                folder: 'users/profile',
            });
        }

        if (req.files.coverImage) {
            const coverImagePath = req.files.coverImage[0].path;
            coverImageResult = await cloudinary.uploader.upload(coverImagePath, {
                folder: 'users/cover',
            });
        }

        const updatedData = {};

        if (profileImageResult) {
            updatedData.profileImage = [{
                public_id: profileImageResult.public_id,
                url: profileImageResult.secure_url,
            }];
        }

        if (coverImageResult) {
            updatedData.coverImage = [{
                public_id: coverImageResult.public_id,
                url: coverImageResult.secure_url,
            }];
        }

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        res.status(200).json({
            message: 'Upload successful',
            user: user
        });
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ message: 'Error during upload', error });
    }
};


const userController = {
    getUser,
    getProfile,
    updateProfile,
    uploadProfileAndCoverImg
};

export default userController;

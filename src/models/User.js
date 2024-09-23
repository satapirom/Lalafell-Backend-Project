import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    termsAccepted: {
        type: Boolean,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: '../images/avata-profile.png'  // ตั้งค่าเริ่มต้นสำหรับรูปโปรไฟล์
    },
    termsAcceptedAt: {
        type: Date,
        default: Date.now
    },
    termsVersion: {
        type: String,
        default: '1.0'
    },
}, { timestamps: true });

export default mongoose.model("User", UserSchema);

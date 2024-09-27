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
    profileImage: [{
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    }],
    coverImage: [{
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    }],
}, { timestamps: true });

export default mongoose.model("User", UserSchema);


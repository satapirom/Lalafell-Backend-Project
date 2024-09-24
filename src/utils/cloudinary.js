import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

// ตรวจสอบว่าอยู่ใน environment ไหน
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

// โหลด environment variables
dotenv.config({ path: envFile });

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary configuration is missing. Please check your environment variables.");
}

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;


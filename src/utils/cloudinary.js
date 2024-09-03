import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_SECRET) {
    throw new Error("Cloudinary configuration is missing. Please check your environment variables.");
}

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET
});

export default cloudinary;


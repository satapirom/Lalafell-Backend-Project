import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB connected ✅🙀');
    } catch (err) {
        console.error(`MongoDB connection error: ${err.message} ❌😒`);
        process.exit(1);  // ออกจากโปรแกรมหากการเชื่อมต่อล้มเหลว
    }
};

export default connectDB;

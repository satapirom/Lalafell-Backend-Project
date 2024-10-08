import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './src/utils/connectDB.js';
import mongoose from 'mongoose';
import authRoute from './src/routes/authRoute.js';
import userRoute from './src/routes/userRoute.js';
import orderRoute from './src/routes/orderRoute.js';
import addressRoute from './src/routes/addressRoute.js';
import payMethodRoute from './src/routes/payMethodRoute.js';
import checkoutRoute from './src/routes/checkoutRoute.js';
import reviewRoute from './src/routes/reviewRoute.js';
import cartRoute from './src/routes/CartRoute.js';
import bodyParser from 'body-parser';

// admin
import productsRoute from './src/routes/productsRoute.js';

// โหลดตัวแปรสภาพแวดล้อมจากไฟล์ .env ตาม environment
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const app = express();
app.use(morgan('combined'));

// ตรวจสอบว่าตัวแปร MONGO_URI ถูกกำหนดหรือไม่
if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI is not defined in the environment variables.');
    process.exit(1); // ออกจากโปรแกรมถ้าตัวแปร MONGO_URI ไม่ถูกกำหนด
}

// middlewares
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));

// connect to MongoDB
connectDB();

// เส้นทาง API ต่างๆ
app.use("/", authRoute);
app.use("/", userRoute);
app.use("/", orderRoute);
app.use("/", addressRoute);
app.use("/", payMethodRoute);
app.use("/", checkoutRoute);
app.use("/", reviewRoute);
app.use("/", cartRoute);

// admin
app.use("/", productsRoute);

// error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} ✅🌎`);
});

// close server gracefully
process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing HTTP server');
    await mongoose.connection.close(); // ปิดการเชื่อมต่อ MongoDB
    process.exit(0); // ออกจากโปรแกรม
});


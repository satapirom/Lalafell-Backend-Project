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
import payMethodRoute from './src/routes/payMethodRoute.js'
import checkoutRoute from './src/routes/checkoutRoute.js'
import reviweRoute from './src/routes/reviewRoute.js'
import bodyParser from 'body-parser';

// admin
import productsRoute from './src/routes/productsRoute.js';

dotenv.config();

const app = express();

app.use(morgan('combined'));

if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI is not defined in the environment variables.');
    process.exit(1);
}

// CORS configuration
const allowedOrigins = ['https://lalafell-frontend-project.vercel.app', 'http://localhost:3000'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect to MongoDB
connectDB();

// Routes
app.use("/", authRoute);
app.use("/", userRoute);
app.use("/", orderRoute);
app.use("/", addressRoute);
app.use("/", payMethodRoute);
app.use("/", checkoutRoute);
app.use("/", reviweRoute);
app.use("/", productsRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} ✅🌎`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing HTTP server');
    await mongoose.connection.close();
    process.exit(0);
});
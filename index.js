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
import wishlistRoute from './src/routes/wishlistRoute.js';
import productsRoute from './src/routes/productsRoute.js';

// Load environment variables from .env file based on environment
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const app = express();
app.use(morgan('combined'));

// Check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI is not defined in the environment variables.');
    process.exit(1); // Exit the program if MONGO_URI is not defined
}

// Middleware
app.use(cors({
    origin: "*", // Ensure this matches your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Define API routes
app.use("/", authRoute);
app.use("/", userRoute);
app.use("/", orderRoute);
app.use("/", addressRoute);
app.use("/", payMethodRoute);
app.use("/", checkoutRoute);
app.use("/", reviewRoute);
app.use("/", cartRoute);
app.use("/", wishlistRoute);
app.use("/", productsRoute);

// General error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} ✅🌎`);
});

// Close server gracefully
process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing HTTP server');
    await mongoose.connection.close(); // Close MongoDB connection
    process.exit(0); // Exit the program
});


import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productRoute from './routes/product.route.js';
import authRoute from './routes/auth.route.js';
import reviewRoute from './routes/review.route.js';
import orderRoute from './routes/order.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import getSecret from './config/secrets.js';

const app = express();
dotenv.config();

mongoose.set('strictQuery', true);

const connect = async () => {
    try {
        // Retrieve secret
        const secret = await getSecret();
        // Use the secret to connect to MongoDB
        await mongoose.connect(secret.MONGO_URL);
        console.log("hey hey mongoo : ", secret)
        console.log('DB Connected successfully!');
    } catch (error) {
        console.log(error);
    }
};

const corsOptions = {
    origin: ['http://localhost:5000/products'],
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/products', productRoute);
app.use('/auth', authRoute);
app.use('/review', reviewRoute);
app.use('/order', orderRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || 'Something went wrong!';
    return res.status(errorStatus).send(errorMessage);
});

app.listen(5000, () => {
    connect();
    console.log('Backend server is running!');
});

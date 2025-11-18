import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import errLogger from './middleware/logErrors.js';
import reqLogger from './middleware/logRequests.js';
import connectCloud from './config/cloudinary.js';
import connectMongo from './config/mongoDB.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoute.js';

// Port number
const PORT = process.env.PORT;

// Initialize Express
const app = express();

app.use(reqLogger);
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
];

// middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// connecting to third-party-apps cloudinary and mongodb
connectCloud();
connectMongo();

app.get('/', (req, res) => {
  return res.send('✅App Is Working');
});
// user routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use(errLogger);

app.listen(PORT, () =>
  console.log(`Listening on Server PORT:${process.env.PORT} ✅`)
);

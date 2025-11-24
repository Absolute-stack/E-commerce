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

const PORT = process.env.PORT;
const app = express();

// Must be very FIRST middleware when using rate-limit on Render
app.set('trust proxy', true);

// Log requests
app.use(reqLogger);

// Fix CORS allowedOrigins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

connectCloud();
connectMongo();

app.get('/', (req, res) => {
  res.send('✅ App Is Working');
});

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.use(errLogger);

app.listen(PORT, () => console.log(`Listening on Server PORT: ${PORT} ✅`));

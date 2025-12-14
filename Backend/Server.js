import cookieParser from 'cookie-parser';
import errLogger from './middleware/logErrors.js';
import reqLogger from './middleware/logRequests.js';
import connectDB from './config/connectDB.js';
import connectCloud from './config/connectCloud.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoute.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import compression from 'compression';

const PORT = process.env.PORT;
const app = express();

// Must be very FIRST middleware when using rate-limit on Render
app.set('trust proxy', true);

// Log requests
app.use(reqLogger);

// compression futher optimizations
app.use(
  compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) return false;
      return compression.filter(req, res);
    },
  })
);

// Fix CORS allowedOrigins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

app.get('/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).send('OK');
  } catch (err) {
    res.status(500).send('DB ERROR');
  }
});

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
connectDB();

app.get('/', (req, res) => {
  res.send('✅ App Is Working');
});

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.use(errLogger);

app.listen(PORT, () => console.log(`Listening on Server PORT: ${PORT} ✅`));

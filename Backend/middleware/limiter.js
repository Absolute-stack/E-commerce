import rateLimit from 'express-rate-limit';

// Fix for Render / Vercel / Railway / NGINX
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,

  // IMPORTANT FIX:
  skipFailedRequests: false,
  keyGenerator: (req, res) => {
    // If trust proxy is enabled, Express stores client IP correctly here
    return req.ip;
  },
});

export default loginLimiter;

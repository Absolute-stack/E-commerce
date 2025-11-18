import express from 'express';
import {
  allOrders,
  updateStatus,
  userOrders,
  verifyPayment,
} from '../controllers/orderController.js';
import userAuth from '../middleware/userAuth.js';
const orderRouter = express.Router();
// admin features
orderRouter.post('/list', allOrders);
orderRouter.post('/status', updateStatus);

orderRouter.post('/verify', verifyPayment);
orderRouter.post('/userorders', userAuth, userOrders);

export default orderRouter;

import express from 'express';
import {
  addToCart,
  updateCart,
  getCart,
  clearCart,
} from '../controllers/cartController.js';
import userAuth from '../middleware/userAuth.js';
const cartRouter = express.Router();

cartRouter.post('/add', userAuth, addToCart);
cartRouter.post('/get', userAuth, getCart);
cartRouter.post('/update', userAuth, updateCart);
cartRouter.post('/clear', userAuth, clearCart);
export default cartRouter;

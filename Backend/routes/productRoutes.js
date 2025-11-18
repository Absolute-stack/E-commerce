import express from 'express';
import {
  listProduct,
  addProduct,
  removeProduct,
  updateProduct,
  getProduct,
} from '../controllers/productController.js';
import upload from '../middleware/multer.js';
const productRouter = express.Router();
productRouter.get('/list', listProduct);
productRouter.post(
  '/add',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]),
  addProduct
);
productRouter.post(
  '/update',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]),
  updateProduct
);
productRouter.delete('/remove', removeProduct);
productRouter.post('/get', getProduct);

export default productRouter;

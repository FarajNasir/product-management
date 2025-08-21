import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getProductBarcode,
  getProductQRCode
} from '../controllers/productController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(upload, createProduct);

router.route('/categories')
  .get(getCategories);

router.route('/:id')
  .get(getProductById)
  .put(upload, updateProduct)
  .delete(deleteProduct);

router.route('/:id/barcode')
  .get(getProductBarcode);

router.route('/:id/qrcode')
  .get(getProductQRCode);

export default router;
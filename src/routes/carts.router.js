import express from 'express';
import {
  createCart,
  getCartById,
  addProductToCart,
  deleteProductFromCart,
  clearCart,
} from '../controllers/carts.controller.js';

const router = express.Router();

router.post('/', createCart);
router.get('/:cid', getCartById);
router.post('/:cid/product/:pid', addProductToCart);
router.delete('/:cid/product/:pid', deleteProductFromCart);
router.delete('/:cid', clearCart);

export default router;

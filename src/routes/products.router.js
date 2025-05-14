import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  renderProductListView,
  renderProductDetailView,
} from '../controllers/products.controller.js';

const ProductsRouter = express.Router();

ProductsRouter.get("/", getAllProducts);
ProductsRouter.get("/view", renderProductListView);
ProductsRouter.get("/view/:pid", renderProductDetailView);
ProductsRouter.get("/:pid", getProductById);
ProductsRouter.post("/", createProduct);
ProductsRouter.put("/:pid", updateProduct);
ProductsRouter.delete("/:pid", deleteProduct);

export default ProductsRouter;

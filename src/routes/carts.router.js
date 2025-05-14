import express from 'express';
import mongoose from 'mongoose';
import Cart from '../models/cart.model.js';

const router = express.Router();

// Validar ObjectId antes de hacer la consulta
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const cart = new Cart();
    await cart.save();
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un carrito
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    // Validar ObjectId del carrito
    if (!isValidObjectId(cid)) {
      return res.status(400).json({ status: "error", message: "ID de carrito inválido" });
    }

    const cart = await Cart.findOne({ _id: cid }).populate("products.product");
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no existe o no se encuentra" });

    res.status(200).json({ status: "success", payload: cart.products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Agregar producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
      return res.status(400).json({ status: "error", message: "ID de carrito o producto inválido" });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no existe o no se encuentra" });

    const productInCart = cart.products.find(p => p.product.toString() === pid);
    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Eliminar un producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    // Validar ObjectId del carrito y del producto
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
      return res.status(400).json({ status: "error", message: "ID de carrito o producto inválido" });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { _id: cid },
      { $pull: { products: { product: pid } } },
      { new: true }
    );
    if (!updatedCart) return res.status(404).json({ status: "error", message: "Carrito no existe o no se encuentra" });

    res.status(200).json({ status: "success", message: `Producto con ID ${pid} eliminado del carrito ${cid}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    // Validar ObjectId del carrito
    if (!isValidObjectId(cid)) {
      return res.status(400).json({ status: "error", message: "ID de carrito inválido" });
    }

    const updatedCart = await Cart.findByIdAndUpdate(
      cid,
      { $set: { products: [] } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }

    res.status(200).json({
      status: "success",
      message: `Todos los productos del carrito ${cid} han sido eliminados.`,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;

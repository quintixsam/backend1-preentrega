import mongoose from 'mongoose';
import Cart from '../models/cart.model.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createCart = async (req, res) => {
    try {
    const cart = new Cart();
    await cart.save();
    res.status(201).json({ status: "success", payload: cart });
    } catch (error) {
    res.status(500).json({ error: error.message });
    }
};

export const getCartById = async (req, res) => {
    try {
    const { cid } = req.params;

    if (!isValidObjectId(cid)) {
        return res.status(400).json({ status: "error", message: "ID de carrito inválido" });
    }

    const cart = await Cart.findOne({ _id: cid }).populate("products.product").lean();
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no existe o no se encuentra" });

    res.status(200).json({ status: "success", payload: cart.products });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

export const addProductToCart = async (req, res) => {
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
};

export const deleteProductFromCart = async (req, res) => {
    try {
    const { cid, pid } = req.params;

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
};

export const clearCart = async (req, res) => {
    try {
    const { cid } = req.params;

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
};

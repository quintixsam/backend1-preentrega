import express from 'express';
import ProductManager from '../ProductManager.js';
import uploader from '../utils/uploader.js';

const productManager = new ProductManager();

const ProductsRouter = express.Router();

ProductsRouter.post('/', uploader.single("file"), async(req, res) => {
if(!req.file) return res.status(401).json({ message: "Falta adjuntar la imagen" });
const title = req.body.title;
const price = parseInt(req.body.price);
const thumbnail = "/img/" + req.file.filename;

    await productManager.AddProduct({ title, price, thumbnail });
    //redireccionamos al usuario
    res.redirect('/dashboard');
});

export default ProductsRouter;
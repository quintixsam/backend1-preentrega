import express from "express";
import ProductManager from "../ProductManager.js";

const viewsRouter = express.Router();

const productManager = new ProductManager("./src/data/products.json");


//endpointss
viewsRouter.get('/', async(req, res)=>{
    try {
    const products = await productManager.getProducts();
    res.render('home', { products });
    }catch(error){
    res.status(500).send({ message: error.message});
  }
});

viewsRouter.get('/realTimeProducts', async(req, res)=>{
    try {
    const products = await productManager.getProducts();
    res.render('realtimeproducts', { products });
    }catch(error){
    res.status(500).send({ message: error.message});
}
});

export default viewsRouter;
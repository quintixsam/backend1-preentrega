import express from "express";
import Product from "../models/product.model.js";

const viewsRouter = express.Router();


//endpointss
viewsRouter.get('/', async(req, res)=>{
    res.redirect("/products");
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
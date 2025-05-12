import express from 'express';
import Product from '../models/product.model.js';


const ProductsRouter = express.Router();

ProductsRouter.get("/", async(req, res) => {
try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const products = await Product.paginate({}, { limit, page });
    res.status(200).json({ status: "success", payload: products });
} catch (error) {
    res.status(500).json({ message: error.message })
}
})

ProductsRouter.get("/:pid", async (req, res) => {
try {
    const product = await Product.findById(req.params.pid);
    if (!product) return res.status(404).json({ message: "Producto no existe o no se encuentra" });
    res.status(200).json({ status: "success", payload: product});
} catch (error) {
    res.status(500).json({ message: error.message });
}
});

ProductsRouter.post("/", async (req, res) => {
try {
    const newProduct = req.body;
    const product = new Product(newProduct);
    await product.save();
    res.status(201).json({ status: "success", payload: product });
} catch (error) {
    res.status(500).json({ message: error.message });
}
});

ProductsRouter.put("/:pid", async (req, res) => {
try {
    const updated = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true});
    if (!updated) return res.status(404).json({ message: "Producto no existe o no se encuentra"});
    res.status(200).json({ status: "success", payload: updated });
} catch (error) {
    res.status(500).json({ message: error.message });
}
});

ProductsRouter.delete("/:pid", async (req, res) => {
try {
    const deleted = await Product.findByIdAndDelete(req.params.pid);
    if (!deleted) return res.status(404).json({ message: "Producto no existe o no se encuentra" });
    res.status(200).json({ message: `Producto con id: ${req.params.pid} eliminado` });
} catch (error) {
    res.status(500).json({ message: error.message });
}
});

//endpoint para practicar aggregations
ProductsRouter.get("/aggregations/example", async(req, res)=> {
try {
    const response = await Product.aggregate([
        //traemos productos que tengan la palabra "basic" dentro de "description"
    { $match: { $text: { $search: "basic" } } },
    //se traen productos que cuesten mas de 8.000
    { $match: { price: { $gt: 8000 } } },
    //se reaiza una proyeccion para traer datos que nos interesen
    { 
        $project: {
        title: 1,
        description: 1,
        category: 1,
        price: 1
        } 
    }
    ]);
    res.status(200).json({ status: "success", payload: response });
} catch (error) {
    res.status(404).json({ message: error.message });
}
});

export default ProductsRouter;
import express from "express";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";

const app = express();
app.use(express.json());

const productManager = new ProductManager();
const cartManager = new CartManager();

//endpoints
//Productos

app.get('/api/products', async(req, res)=> {
    const Products = await productManager.getProductById();
    res.status(200).json({ Products: Products, message: "Lista de Productos" });
});

//Productos por id
app.get('/api/products:pid', async(req, res)=> {
    const Product = await productManager.getProductById(req.params.pid);
    if (Product) {
        res.status(200).json({ Product: Product, message: "Producto encontrado" })
    } else {
        res.status(404).json({ Products: Products, message: "No EXISTE" });
    }
});


//Eliminar producto
app.delete('/api/products/:id', async(req, res)=>{
    const ProductId = req.params.id;
    const Products = await productManager.deleteProductById(ProductId);
    if (Products) {
    res.status(200).json({ Products: Products, message: "Producto eliminado" });
    } else {
        res.status(404).json({message: "Producto No existe" });
    }
});

//Añadir producto
app.post('/api/products', async(req, res)=> {
    const newProduct = req.body;
    const Products = await productManager.createProduct(newProduct);
    res.status(201).json({ Products: Products, message: "nuevo Producto creado" });
});

//actualizar producto
app.put('/api/products/:id', async(req, res)=>{
    const ProductId = req.params.id;
    const updatedProduct = req.body;
    const Products = await productManager.updateProductById(ProductId, updatedData);
    res.status(200).json({ Products: Products, message: "Producto actualizado" });
});

                                                        //Carts

//Crear carrito Vacio
app.post('/api/carts', async(req, res)=> {
    const carts = await cartManager.addCart();
    res.status(201).json({ carts, message: "Nuevo carrito Creado" });
});

//Listar produtos pertenecientes al carrito
app.get('/api/carts/:cid', async(req, res) => {
    const cid = req.params.cid;
    const products = await cartManager.getProductsInCartById(cid);
    res.status(200).json({ products, message: "Lista de Productos" });
})


//añadir producto al carrito adecuado
app.post('/api/carts/:cid/product/:pid', async(req,res)=> {
    const cid = req.params.cid;
    const pid = parseInt(req.params.pid);
    const quantity = req.body.quantity;

    const carts = await cartManager.addProductInCart(cid, pid, quantity);
    res.status(200).json({ carts, message: "Nuevo producto añadido" });
})



app.listen(8080, ()=> {
    console.log("Server Iniciado en puerto 8080");
});
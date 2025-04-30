import express from "express";
import http from 'http';
import ProductsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import { engine } from "express-handlebars";
import { Server } from 'socket.io'; 
import ProductManager from "./ProductManager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//handlebars confi
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

const PORT = 8080;



app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//endpoint
app.use('/', viewsRouter);
app.use('/api/products', ProductsRouter);

//websockets
const productManager = new ProductManager("./src/data/products.json");
io.on("connection", (socket)=> {
    console.log("nuevo usuario conectado");

    socket.on("newProduct", async(productData) =>{
    try {
        const newProduct = await productManager.AddProduct(productData);

        io.emit("productAdded", newProduct);
    } catch (error) {
        console.error("ERROR añadir producto", error);
    }
    });


//eliminar producto

socket.on("deleteProduct", async(productId) => {
    try {
        await productManager.deleteProductById(parseInt(productId));
        io.emit("productDeleted", productId);
    } catch (error) {
        console.error("ERROR al eliminar producto", error.message);
    }
});

});








server.listen(PORT, ()=> console.log(`Server Iniciado en http://localhost:${PORT}`));

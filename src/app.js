import express from "express";
import http from 'http';
import { engine } from "express-handlebars";
import { Server } from 'socket.io'; 
import ProductsRouter from "./routes/products.router.js";
import CartsRouter from './routes/carts.router.js';
import viewsRouter from "./routes/views.router.js";
import Product from "./models/product.model.js";
import connectMongoDb from "./config/db.js";
import dotenv from "dotenv";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 8080;

connectMongoDb();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//handlebars confi
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

//endpoints
app.use('/', viewsRouter);
app.use('/api/carts', CartsRouter);
app.use('/api/products', ProductsRouter);

app.use('/products', ProductsRouter);


//websockets
io.on("connection", (socket)=> {
    console.log("nuevo usuario conectado");

    socket.on("newProduct", async(productData) =>{
    try {
        const product = new Product (productData);
        await product.save();
        io.emit("productAdded", product);
        console.log( "Producto Añadido:", product.title );
    } catch (error) {
        console.error( "ERROR añadir producto", error.message );
    }
    });


//eliminar producto

socket.on("deleteProduct", async(productId) => {
    try {
        const deleted =await Product.findByIdAndDelete(productId);
        if (deleted){
            io.emit("productDeleted", productId);
            console.log( "Producto eliminado", productId);
        } else {
            console.warn("Producto No existe o no fue encontrado: ", productId);
        }
    } catch (error) {
        console.error("ERROR al eliminar producto", error.message);
    }
});
});








server.listen(PORT, ()=> console.log(`Server Iniciado en http://localhost:${PORT}`));
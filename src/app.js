import express from "express";
import ProductsRouter from "./routes/products.router.js";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.router.js";


const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));




//handlebars confi
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

//endpoint
app.use('/', viewsRouter);
app.use('/api/Products', ProductsRouter);








app.listen(8080, ()=> {
    console.log("Server Iniciado en puerto 8080");
});
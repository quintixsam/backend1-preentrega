import express from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const viewsRouter = express.Router();

// Redirecciona al listado de productos
viewsRouter.get('/', (req, res) => {
res.redirect("/products");
});

// Vista con productos en tiempo real
viewsRouter.get('/realTimeProducts', async (req, res) => {
try {
    const products = await Product.find().lean(); 
    res.render('realtimeproducts', { products });
} catch (error) {
    res.status(500).send({ message: error.message });
  }
});

viewsRouter.get('/products', async (req, res) => {
try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const options = {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
    lean: true,
    };

    const filter = {};
    if (query) {
    if (query === "true" || query === "false") {
        filter.status = query === "true";
    } else {
        filter.category = { $regex: query, $options: "i" };
    }
    }

    const result = await Product.paginate(filter, options);

    res.render("home", {
    products: result.docs,
    pagination: {
        page: result.page,
        totalPages: result.totalPages,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}`: null,
        nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}`: null,
    },
    });
} catch (error) {
    res.status(500).render("error", { error: error.message });
}
});

viewsRouter.get('/products/:pid', async (req, res) => {
try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) {
    return res.status(404).render("error", { error: "Producto no existe o no se encuentra" });
    }
    res.render("productDetail", { product });
} catch (error) {
    res.status(500).render("error", { error: error.message });
}
});

// Vista del carrito con populate
viewsRouter.get("/carts/:cid", async (req, res) => {
try {
    const cart = await Cart.findById(req.params.cid)
    .populate("products.product")
    .lean();

    if (!cart) {
    return res.status(404).render("error", { error: "Carrito no existe o no se encuentra" });
    }

    res.render("cartDetail", { cart });
} catch (error) {
    res.status(500).render("error", { error: error.message });
}
});


export default viewsRouter;

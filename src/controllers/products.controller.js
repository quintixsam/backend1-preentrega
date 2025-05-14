import Product from '../models/product.model.js';


export const getAllProducts = async (req, res) => {
    try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = {};
    if (query) {
        if (query === "true" || query === "false") {
        filter.status = query === "true";
        } else {
        filter.category = query;
        }
    }

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
        lean: true,
    };

    const result = await Product.paginate(filter, options);

    const buildLink = (pageNum) => {
        const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
        const params = new URLSearchParams({
        limit,
        page: pageNum,
        ...(sort && { sort }),
        ...(query && { query }),
        });
        return `${baseUrl}?${params.toString()}`;
    };

    res.status(200).json({
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
        nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
    });
    } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
    }
};

// orden
export const renderProductListView = async (req, res) => {
    try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = {};
    if (query) {
        if (query === "true" || query === "false") {
        filter.status = query === "true";
        } else {
        filter.category = query;
        }
    }

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
        lean: true,
    };

    const result = await Product.paginate(filter, options);

    const buildLink = (pageNum) => {
        const params = new URLSearchParams({
        limit,
        page: pageNum,
        ...(sort && { sort }),
        ...(query && { query }),
        });
        return `/products/view?${params.toString()}`;
    };

    res.render("home", {
        products: result.docs,
        pagination: {
        page: result.page,
        totalPages: result.totalPages,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
        nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
        },
    });
    } catch (error) {
    res.status(500).send("Error al cargar los productos.");
    }
};

// productdetail
export const renderProductDetailView = async (req, res) => {
    try {
    const { pid } = req.params;
    const product = await Product.findById(pid).lean();

    if (!product) {
        return res.status(404).render('error', { message: 'Producto no existe o no se encuentra' });
    }

    const cartId = '66500a3192f504e7a267bd0b'; 
    res.render('productDetail', { product, cartId });
    } catch (error) {
    res.status(500).render('error', { message: error.message });
    }
};

// api
export const getProductById = async (req, res) => {
    try {
    const product = await Product.findById(req.params.pid);
    if (!product) return res.status(404).json({ message: "Producto no existe o no se encuentra" });

    res.status(200).json({ status: "success", payload: product });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ status: "success", payload: product });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
    const updated = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Producto no existe o no se encuentra" });

    res.status(200).json({ status: "success", payload: updated });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
    const deleted = await Product.findByIdAndDelete(req.params.pid);
    if (!deleted) return res.status(404).json({ message: "Producto no existe o no se encuentra" });

    res.status(200).json({ message: `Producto con ID ${req.params.pid} eliminado` });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

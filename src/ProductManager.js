import fs from 'fs';

class ProductManager {
    constructor() {
        this.path = './src/Products.json';
    }

    //GetProducts
    getAllProducts = async () => {
    const ProductsJson = await fs.promises.readFile(this.path, 'utf-8');
    const Products = JSON.parse(ProductsJson);
    return Products;
    }

    //getProductById
    getProductById = async (ProductId) => {
     // Lee el archivo.json
    const ProductsJson = await fs.promises.readFile(this.path, 'utf-8');
    // Convierte el contenido de JSON a un array de productos
    const Products = JSON.parse(ProductsJson);
     // Busca el producto con el id proporcionado
    const Product = Products.find((ProductData) => ProductData.id === ProductId);
    // Devuelve el Producto encontrado
    return Product;
    }

    //addProduct
    createProduct = async (product) => {
    // Lee el archivo .json
    const ProductsJson = await fs.promises.readFile(this.path, 'UTF-8');
    // Convierte el Contenido de JSON a un array de productos
    const Products = JSON.parse(ProductsJson);
    // Genera un id Unico para el nuevo Producto
    const id = this.generateId(Products);
     // Añade el nuevo producto al array, con el id generado
    Products.push({ id, ...newProduct });
    // Sobreescribe el archivo .Json con la lista actualizada 
    await fs.promises.writeFile(this.path, JSON.stringify(Products, null, 2), 'utf-8');
    // Devuelve la lista actualizada de productos
    return Products;
}

    //Actualiza los datos del producto por su id
    updateProductById = async (ProductId, updateData) => {
    // Lee el archivo .json
    const ProductsJson = await fs.promises.readFile(this.path, 'UTF-8');
    // Convierte el Contenido de JSON a un array de productos
    const Products = JSON.parse(ProductsJson);
    // Busca el indice del producto para actualizarlo
    const product = Products.find((product) => product.id === id);
    //Actualiza el producto con los nuevos datos
    Products[index] = { ...Products[index], ...updatedData };
    await fs.promises.writeFile(this.path, JSON.stringify(users, null, 2), 'utf-8');
    return Products;
    }

    //Delete ProductById
    deleteProductById = async (ProductId) => {
    // Lee el archivo .json
    const ProductsJson = await fs.promises.readFile(this.path, 'UTF-8');
    // Convierte el Contenido de JSON a un array de productos
    const Products = JSON.parse(ProductsJson);
    //Filtra productos, eliminando el producto que tiene el id proporcionado
    const ProductsFilter = Products.filter((ProductData) => ProductData.id !== ProductId);
    // Sobreescribe el archivo .json con la lista filtrada
    await fs.promises.writeFile(this.path, JSON.stringify(ProductsFilter, null, 2), 'utf-8');
    return ProductsFilter;
    }
}

export default ProductManager;
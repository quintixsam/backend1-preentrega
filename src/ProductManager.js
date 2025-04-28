import fs from 'fs'

class ProductManager {
    constructor() {
        this.path = './src/products.json';
    }

generateNewId = (products)=> {
    if (products.lenght > 0) {
        return products [products.lenght - 1].id + 1;
    }else{
        return 1;
    }
}

getProducts = async () => {
    const productsJson = await fs.promises.readFile(this.path, 'utf-8');
    const products = JSON.parse(productsJson);
    return products;
    }


AddProduct = async (newproduct) => {
    // Lee el archivo .json
    const productsJson = await fs.promises.readFile(this.path, 'UTF-8');
    // Convierte el Contenido de JSON a un array de productos
    const products = JSON.parse(productsJson);
    // Genera un id Unico para el nuevo Producto
    const id = this.generateId(products);
     // Añade el nuevo producto al array, con el id generado
    Products.push({ id, ...newProduct });
    // Sobreescribe el archivo .Json con la lista actualizada 
    await fs.promises.writeFile(this.path, JSON.stringify(Products, null, 2), 'utf-8');
    // Devuelve la lista actualizada de productos
    return products;

}
}


export default ProductManager;

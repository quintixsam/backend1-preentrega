import fs from "fs";

class CartManager{
    constructor(){
        this.path = './src/carts.json';
    }

    generateNewId = (carts) => {
        if(carts.length > 0){
            return carts[carts.length - 1].id + 1;
        }else{
            return 1;
        }
    }

    //addCart
    addCart = async() => {
        const cartsJson = await fs.promises.readFile(this.path, 'utf-8');
        const carts = JSON.parse(cartsJson);

        const id = this.generateNewId(carts);
        carts.push({ id , Products: [] })

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8' );
        return carts;
    }

    //getProductsInCartById
    getProductsInCartById = async(cid) => {
        const cartsJson = await fs.promises.readFile(this.path, 'utf-8');
        const carts = JSON.parse(cartsJson);

        const cart = carts.find((cartData)=> cartData.id == cid );
        return cart.products;
    }

    //addProductInCart
    addProductInCart = async(cid, pid, quantity) => {
    const cartsJson = await fs.promises.readFile(this.path, 'utf-8');
    const carts = JSON.parse(cartsJson);

    carts.forEach(cart => {
        if(cart.id == cid){
            cart.Products.push({ id : pid , quantity });
        } 
    });

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');

    return carts;
    }
};

export default CartManager;
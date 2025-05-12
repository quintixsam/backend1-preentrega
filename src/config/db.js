import mongoose from "mongoose";

const connectMongoDb = async() => {
    try {
        await mongoose.connect("mongodb+srv://banckend1project:piepp@cluster0.slnjwqd.mongodb.net/myEcommerce?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Conectado con MongoDb!");
    } catch (error) {
        console.log("Error al conectar con mongodb");
    }
}

export default connectMongoDb;
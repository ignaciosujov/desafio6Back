import mongoose from "mongoose";

const productShema = new mongoose.Schema({
    title: String,
    description: String, 
    price: Number, 
    status: Boolean, 
    code: String, 
    stock: Number, 
    category: String, 
    thumbnail: String
})

const Product = mongoose.model('products', productShema)

export default Product
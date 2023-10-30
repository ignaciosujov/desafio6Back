import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new mongoose.Schema({
    title: String,
    description: String, 
    price: Number, 
    status: Boolean, 
    code: String, 
    stock: Number, 
    category: String, 
    thumbnail: String
})

productSchema.plugin(mongoosePaginate)
const Product = mongoose.model('products', productSchema)

export default Product
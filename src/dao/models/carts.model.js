import mongoose from "mongoose";

const cartShema = new mongoose.Schema({
    products: [
        {
            productId: [],
            quantity: Number,
        }
    ]
})

const Cart = mongoose.model('Cart', cartShema)

export default Cart
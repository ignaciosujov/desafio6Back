import mongoose from "mongoose";

const cartShema = new mongoose.Schema({
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        }
    ]
})

const Cart = mongoose.model('carts', cartShema)

export default Cart
import { Router } from "express";
import Cart from "../dao/models/carts.model.js";
import Product from "../dao/models/products.model.js";


const router = Router()

router.get('/create', async(req, res) => {
    res.render('create', {})
})


router.post('/', async (req, res) => {
    try{

        const products = await Product.find().lean().exec()
        res.render('products', { products })

        const newCart = req.body
        const result = await Cart.create(newCart)
        
        res.redirect('/cart')


    }catch(err){

    }
})


export default router
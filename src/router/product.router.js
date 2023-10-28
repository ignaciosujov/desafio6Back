import { Router } from "express";
import Product from "../dao/models/products.model.js";

const router = Router()

// Listar productos
router.get('/', async(req, res) => {
    const products = await Product.find().lean().exec()

    res.render('productList', { products })
})

// Pagina para crear productos
router.get('/create', async(req, res) => {
    res.render('create', {})
})

// POST para crear productos
router.post('/', async(req, res) => {
    try {
        const newProduct = req.body
        const result = await Product.create(newProduct)
        
        res.redirect('/product')
    } catch(error) {
        res.render('error', {error: 'Error al crear el product'})
    }
})

// Buscar un producto con id
router.get('/:pid', async (req, res) => {
    try {
        const id = req.params.pid
        const product = await Product.findOne({ _id: id }).lean().exec()
        
        res.render('one', { product })
    } catch (error) {
        
        res.status(500).json(error)    
    }
})


// Borrar un producto con id
router.delete('/:pid', async (req, res) => {
    try {
        const id = req.params.pid
        await Product.deleteOne({ _id: id })

        return res.json({ status: 'success' })
    } catch (error) {
        res.status(500).json(error)
    }
}) 

export default router
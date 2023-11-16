import { Router } from "express";
import Product from "../dao/models/products.model.js";

const router = Router()

// Listar productos
router.get('/', async(req, res) => {
    try{
        // Parámetros
        const { limit = 10, query = '', sort = 'asc', page = 1 } = req.query;

        // Filtrar los productos
        let products = await Product.find().lean().exec();

        // bucar por categoría
        if (query) {
            products = products.filter((product) => {
                return product.category.toLowerCase() === query.toLowerCase();
            });
        }

        // ordenamiento por precio (sort)
        if (sort === 'asc') {
            products.sort((a, b) => a.price - b.price);
        } else if (sort === 'desc') {
            products.sort((a, b) => b.price - a.price);
        }

        // Filtrar los productos según el límite y la página
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const limitedProducts = products.slice(startIndex, endIndex);
        const user = req.session.user
        console.log(user)
        res.render('productList', { products: limitedProducts, user })
        

    }catch(err) {
        res.status(500).json({ error: 'Error en la búsqueda de productos' });
    }
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
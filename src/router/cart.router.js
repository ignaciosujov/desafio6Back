import { Router } from "express";
import Cart from "../dao/models/carts.model.js";
import Product from "../dao/models/products.model.js";

const router = Router()

// crear carts
router.post('/', async (req, res) => {
    try{
        const newCart = await Cart.create({items: []})
        res.status(201).json(newCart)
    }catch(err){
        res.status(500).json({ error: 'Error al crear un carrito' });
    }
})


// Añadir products al cart por body
router.post('/:cid/addProducts', async (req, res) => {
    try{
        const cartId = req.params.cid;
        const { productId, quantity } = req.body;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        if (!Array.isArray(cart.products)) {
            cart.products = []; // Inicializar como un array si no lo es
        }

        // Verificar si el product ya existe en el cart y actualizar la cantidad
        const existingProduct = cart.products.find((p) => p.productId.toString() === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            // Agregar el producto al carrito
            cart.products.push({ productId, quantity });
        }

        await cart.save();
        res.status(201).json(cart.products);

    }catch(err) {
        console.log(err)
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
})

// obtener carrito by id
router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.status(200).json(cart.products);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Error al obtener productos del carrito' });
    }
})

// eliminar producto de un carrito

router.delete('/:cid/products/:pid', async (req, res ) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Filtrar los productos para eliminar el producto 
        cart.products = cart.products.filter((p) => p.productId.toString() !== productId);

        await cart.save();
        res.status(200).json(cart.products);
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
})

// eliminar todos los products de un cart
router.delete('/:cid', async (req,res) => {
    try{

        const cartId = req.params.cid

        const cart = await Cart.findById(cartId)

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        cart.products = []
        await cart.save();

        res.status(200).json(cart);


    }catch(err) {

    }
})

router.put('/:cid/products/:pid', async (req, res) => {
    try{
        const cartId = req.params.cid
        const productId = req.params.pid
        const  quantity  = req.body.quantity
    
        const cart = Cart.findById(cartId)

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        if (!Array.isArray(cart.products)) {
            cart.products = [];
        }

        const productInCart = cart.products.find(product => product.productId.toString() === productId)

        if(!productInCart){
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        productInCart.quantity = quantity

        await Cart.save()

        res.status(200).json(cart);


    }catch(err){
        console.log(err);
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' })
    }

})

export default router
import express from 'express'
import productRouter from './router/product.router.js'
import cartRouter from './router/cart.router.js'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import __dirname from './util.js'


// Inicializamos las variables
const app = express()
const mongoURL = 'mongodb+srv://ignaciosujov:4W4FIUeEU6lt1wTx@cluster0.denqn1r.mongodb.net/'
const mongoDBName = 'ecommerce'

// Para traer la info de POST como JSON
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Congiurar el motor de plantillas
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// Carpeta publica
app.use(express.static( __dirname + '/public' ))

// Configuracion de rutas
app.get('/health', (req, res) => res.send('ok'))
app.use('/product', productRouter)
app.use('/cart', cartRouter)

// Conectamos Mongo
const env = async () => {
    mongoose.connect(mongoURL, { dbName: mongoDBName})
        .then(() => {
            console.log('DB connected! 😎 ')
            // Server RUN !!
            app.listen(8080, () => console.log(`Listening 🏃...`)) 
        })
        .catch(error => {
            console.error('Error connect DB 🚑 ')
        })

}

env()


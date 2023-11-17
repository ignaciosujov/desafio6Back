import express from 'express'
import productRouter from './router/product.router.js'
import cartRouter from './router/cart.router.js'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import __dirname from './util.js'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import initializePassport from './config/passport.config.js'

import viewsRouter from './router/views.router.js'
import sessionRouter from './router/session.router.js'
import passport from 'passport'


// Inicializamos las variables
const app = express()
const mongoUrl = 'mongodb+srv://ignaciosujov:4W4FIUeEU6lt1wTx@cluster0.denqn1r.mongodb.net/'
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

// Config sessions
app.use(session({
    store: MongoStore.create({
        mongoUrl,
        dbName: mongoDBName,
        ttl: 100
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Configuracion de rutas
app.use('/', viewsRouter)
app.use('/api/session', sessionRouter)
app.get('/health', (req, res) => res.send('ok'))
app.use('/product', productRouter)
app.use('/cart', cartRouter)

// Conectamos Mongo
const env = async () => {
    mongoose.connect(mongoUrl, { dbName: mongoDBName})
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


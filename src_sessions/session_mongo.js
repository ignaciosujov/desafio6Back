import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'

const app = express()
const mongoUrl = 'mongodb+srv://ignaciosujov:4W4FIUeEU6lt1wTx@cluster0.denqn1r.mongodb.net/'


app.use(session({
    store: MongoStore.create({
        mongoUrl,
        dbName: 'ecommerce',
        ttl: 100
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.get('/', (req, res) => {
    res.send('OK')
})

app.get('/login', (req, res) => {
    if(req.session.user) return res.send('Already logged!')

    const { username } = req.query
    if (!username) return res.send('Need an username')

    req.session.user = { username }
    return res.send('Login success')
})

function auth(req, res, next){
    return req.session?.user ? next() : res.status(401).send('Auth error')
}

function auth(req, res, next) {
    return res.session?.user ? next() : res.status(401).send('Auth error')
}

app.get('/private', auth, (req, res) => {
    res.send('Private page')
})

app.listen(8080)
import express from 'express'
import session from 'express-session'
import  FileStore  from 'session-file-store'

const app = express()
const fileStore = FileStore(session)

app.use(session({
    store: new fileStore({
        path: './sessions', //donde se va a guardar
        ttl: 100,   //tiempo de vida
        retries: 2  //intentos de leer archivo antes de arrojar error
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

app.get('/private', auth, (req, res) => {
    res.send('Private page')
})

app.listen(8080)
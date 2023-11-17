import { Router } from "express";
import passport from "passport";

const router = Router()

router.get('/', (req, res) => {
    if(req.session?.user) {
        return res.redirect('/profile')
    }
    
    return res.render('index', {})
    
})

router.get('/login', (req, res) => {
    if(req.session?.user) {
        return res.redirect('/profile')
    }
    res.render('login', {})

})

router.get(
    '/login-github',
    passport.authenticate('github', {scope: ['user:email']}),
    async (req, res) => {}
)

router.get(
    '/githubcallback',
    passport.authenticate('github', {failureRedirect: '/'}),
    async(req, res) => {
        console.log('Callback: ', req.user)
        req.session.user = req.user

        console.log(req.session)
        res.redirect('/')
    }
)

router.get('/singup', (req, res) => {
    if(req.session?.user) {
        return res.redirect('/profile')
    }

    res.render('singup', {})
})

router.get('/profile', auth, (req, res) => {
    const user = req.session.user

    res.render('profile', user )
})

function auth(req, res, next){
    if(req.session?.user) return next()
    res.redirect('/')
}

function authAdmin(req, res, next){
    if(req.session?.user && req.session.user.rol === 'admin') next()

    return res.status(401).send('Auth error')
}

router.get('/private', auth, (req, res) => {
    res.json(req.session.user)
})

export default router

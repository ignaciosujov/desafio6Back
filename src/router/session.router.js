import { Router } from "express";
import UserModel from "../dao/models/user.model.js";
import passport from "passport";

const router = Router()

router.post('/singup', async (req, res) => {
    const user = req.body
    await UserModel.create(user)

    res.redirect('/login')
})

router.post(
    '/login-github',
    passport.authenticate('github', {scope: ['user:email']}),
    async(req, res) => {}
)

router.get(
    '/githubcallback',
    passport.authenticate('github', {failureRedirect: '/'}),
    async (req, res) => {
        console.log('Callback: ', req.user)
        req.session.user = req.user

        console.log(req.session)
        res.redirect('/')
    }
)

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email, password})
    if(!user) return res.redirect('/login')

    req.session.user = user

    res.redirect('/profile')
})

router.get('/logout', async (req, res) => {
    req.session.destroy(err => {
        if(err) return res.send('logout error')

        res.redirect('/')
    })
})

export default router
import passport from "passport";
import GitHubStrategy from 'passport-github2'
import UserModel from "../dao/models/user.model.js";

/* 
App ID: 489163
Client ID: Iv1.85ba710f9b56299a
client secret: eb17524ae49c6e4f3a6380c542589422a81eecaf
*/

const initializePassport = () => {

    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.85ba710f9b56299a',
            clientSecret: 'eb17524ae49c6e4f3a6380c542589422a81eecaf',
            callbackURL: 'http://localhost:8080/product'
        },
        async (accesToken, refreshToken, profile, done) => {
            console.log(profile)

            try{

                const user = await UserModel.findOne({email: profile._json.email})
                if(user){
                    console.log('User already exists')
                    return done(null, user)
                }

                const newUser = {
                    firts_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    password: ''
                }
                const result = await UserModel.create(newUser)

                return done(null, result)
            
            } catch(err){
                return done('Error to login to github' + err)
            }
        }
    ))



    passport.serializeUser((user, done) => {
        done(null, user._id)
    })


    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })


}

export default initializePassport
const passport = require('passport');
const { MySuperStrategy, MyJWTStrategy } = require('../helper/strategy.passport');
const User = require('../model/user.m');
const bcrypt = require('bcrypt');
const { AUTH_ERROR } = require('../helper/enum');
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const { vertifyJWT } = require('../helper/jwt');

// We use Username, not ID here, since every user should have a distinct username (and we don't have to make another getID function :>>)

// Save user into database as serialize
passport.serializeUser((user, done) => {
    const userCast = new User(user);
    done(null, userCast.Username);
});

// Get the user back from the serialize
passport.deserializeUser(async (username, done) => {
    const user = await User.getUser(username);
    if (user) {
        return done(null, user);
    }
});

// Define strategies
const traditional = new MySuperStrategy(
    // The vertify function we want to use: (the remember is for enough parameter)
    async (username, password, done) => {
        const user = await User.getUser(username);
        if (!user) {
            return done(AUTH_ERROR.noUser, null);
        }
        const passwordCheck = await bcrypt.compare(password, user.Password);
        if (!passwordCheck) {
            return done(AUTH_ERROR.wrongPassword, null);
        }
        return done(null, user)
    },
    // The options we'll may want to add (there're already default values)
    {
        usernameFiled: 'username',
        passwordField: 'password'
    }
)

const jwtStrategry = new MyJWTStrategy((token, done) => {
    if (!token) {
        return done('No Token', null);
    }
    try {
        const decoded = vertifyJWT(token);
        return done(null, decoded);
    } catch (error) {
        return done('Invalid Token', null);
    }
});


// This middleware need to export a callback to apply on the app instance (express), because it need to use the passport callback too
module.exports = {
    init(app) {
        app.use(passport.initialize()); // For the authentication (and also session (?))
        app.use(passport.session());    // For session (serialize and deserialize)

        passport.use(traditional);
        passport.use(jwtStrategry);
    },
    // Already configuared passport:
    passport,
}

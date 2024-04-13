const { SessionData } = require('../../helper/session.data');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { toUserJWT } = require('../../helper/jwt');

// class LoginState {
//     constructor() {
//     }
// }

// uses old style render (cause it's data is small)

module.exports = {
    render: [
        // If logged in -> go to /home
        (req, res, next) => {
            const logged = req.isAuthenticated();
            if (logged) {
                return res.redirect('/home');
            }
            next();
        },
        (req, res, next) => {
            const session = new SessionData(req);
            const dark = session.setting.dark;
            const flash = session.flash;
            session.deleteFlash();
            return res.render('outdoor/login', {
                layout: 'plain',
                scripts: ['/setting.client.js'],
                dark: dark,
                usernameError: flash.usernameError,
                passwordError: flash.passwordError,
            }, null);
        }
    ],

    passportauth: [
        // // uses tradition
        // (req, res, next) => {
        //     // the error message will also be set here
        //     passport.authenticate('MySuperStrategy', {
        //         failureRedirect: '/login',
        //     })(req, res, next)
        // },

        // uses super on login, JWT on direct login
        (req, res, next) => {
            // passport.authenticate(['super', 'jwt'], {
            passport.authenticate('super', {
                // failureRedirect: '/login',
                // session: false,
            }, (err, user, info, status) => {
                // this is the callback after this.fail, this.error, this.sucess in Strategy.authenticate
                // it will override default one, so some options may not working
                if (err || !user) {
                    // failureRedirect: '/login',
                    return res.redirect('/login');
                }
                // must call logIn(user) for the rest of the strategy to work (serialize, de-serialize, ...)
                // https://stackoverflow.com/questions/36525187/passport-serializeuser-is-not-called-with-this-authenticate-callback
                // req.logIn(user, { session: false }, (err) => {
                // this bitch is async so no next() outside
                req.logIn(user, { session: false }, (err) => {
                    if (err) {
                        return next(err);
                    }
                    // generate a signed son web token with the contents of user object and return it in the response
                    const token = toUserJWT({ user });
                    res.cookie('jwt', token);
                    // res.set('jwt', token);
                    // must self assign req.user here because session: false
                    req.user = user;
                    return next();
                });
            })(req, res, next)
        },

        // remember me via cookie
        (req, res, next) => {
            const rememberme = req.body.rememberme;
            if (rememberme) {
                req.session.cookie.maxAge = 1000 * 30; // 30s
            } else {
                req.session.cookie.expires = false;
            }
            return res.redirect('/home');
        }
    ],
}
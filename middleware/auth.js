const User = require('../model/user.m');
const { ErrorDisplay } = require('./error');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// // Old:
// function authenticate(req, res, next) {
//     const user = req.session.user;
//     if (!user) {
//         // un-authenticated
//         return next(new ErrorDisplay('401 Unauthorized', 401, 'Authorization required!'));
//     }
//     return next();
// }

// // New:
// function passportAuthenticate(req, res, next) {
//     if (!req.isAuthenticated()) {
//         return next(new ErrorDisplay('401 Unauthorized', 401, 'Authorization required!'));
//     }
//     return next();
// }

// New: JWT
function passportAuthenticate(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user, info, status) => {
        if (status >= 400) {
            return next(new ErrorDisplay('401 Unauthorized', status, info));
        }
        if (!user) {
            return next(new ErrorDisplay('500', 500, err));
        }
        // manually set user. the session is saved via passport session (?)
        // remember, veritfy is stupid
        req.user = user.user;
        return next();
    })(req, res, next);
}

// // Newer (old version): uses JWT, not session, so there may be no user
// function passportAuthenticateJWT(req, res, next) {
//     const token = req.cookies['jwt'];
//     if (!token) {
//         return next(new ErrorDisplay('401 Unauthorized', 401, 'Authorization required!'));
//     }
//     try {
//         const decoded = jwt.verify(token, 'secret');
//         req.user = decoded.user;
//         return next();
//     } catch (error) {
//         return next(new ErrorDisplay('401 Unauthorized', 401, 'Invalid token! Don\'t try to sneak on us'));
//     };
// }

// >>>> =============================================
// Role base 1: can't show 403, Forbidden, but can give different pages on a URL
// Only need to call once
// <<<< =============================================

// function authorize(req, res, next) {
//     let session = req.session;
//     if (session.user.permission === PERMISSION.user) {
//         return userRouter;
//     }
//     else if (session.user.permission === PERMISSION.admin) {
//         return adminRouter;
//     }
//     // un-authorized
//     return next(err);
// }

// >>>> =============================================
// Role based 2: can show 403, but a url only for a single page (there's no other way)
// Call this function in the middleware on each group of router (userRouter, adminRouter, ...)
// <<<< =============================================

function authorize(...role) {
    return (req, res, next) => {
        const user = new User(req.session.user);
        const permission = user.Permission;
        if (role.includes(permission)) {
            return next();
        }
        return next(new ErrorDisplay('403 Forbidden', 403, 'Proper permission is required.'));
    }
}

// Imporvements for this method: https://viblo.asia/p/implementing-role-based-access-control-rbac-in-nodejs-express-MG24BPMzLz3
// Permission here is actually role (because of the database structure), a role may contain many permission

module.exports = { authorize, passportAuthenticate };
// module.exports = { authenticate, authorize, passportAuthenticate, passportAuthenticateJWT };
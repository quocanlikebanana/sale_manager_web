const { express } = require('../config/lib');
const router = express.Router();
const login = require('../controller/outdoor/login.c');
const signup = require('../controller/outdoor/signup.c');
const { configSettings } = require('../controller/outdoor/setting.c');
const ggOAuth = require('../controller/outdoor/google.oauth.c');
const passport = require('passport');
const { upload } = require('../middleware/multer');
const path = require('path');

router.get('/test', (req, res, next) => {
    const testFilePath = path.join(__dirname, '..', 'view/page/test/test.html');
    console.log(testFilePath);
    return res.sendFile(testFilePath);
});

router.post('/test-upload', upload.array('uploadMultiple'), (req, res, next) => {
    console.log(req.files);
    console.log(req.body);
    return res.redirect('/test');
});

router.get('/favicon.ico', (req, res, next) => {
    return res.end();
});

router.get('/api/google', ggOAuth.getConsent);

router.get('/api/google/auth-ed', ggOAuth.handler);

router.post('/setting', configSettings);

router.get('/login', login.render);

router.post('/login', login.passportauth);

router.get('/signup', signup.render);

router.post('/signup', signup.auth);


router.get('/', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info, status) => {
        if (status >= 400) {
            return res.redirect('/login');
        }
        if (!user) {
            return next(new ErrorDisplay('500', 500, err));
        }
        req.user = user.user;
        return res.redirect('/home');
    })(req, res, next);
});

router.post('/logout', (req, res, next) => {
    return req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
})

module.exports = { router };

// // Old default
// // This is for redirect to login when user first in
// router.get('/', (req, res, next) => {
//     const user = req.session.user;
//     if (!user) {
//         return res.redirect('/login');
//     }
//     return res.redirect('/home');
// });

// // Old logout
// router.post('/logout', (req, res, next) => {
//     if (req.session) {
//         req.session.destroy(err => {
//             if (err) {
//                 return next(new UserError('400 Unable to log out', 400, ''));
//             } else {
//                 // It's callback, so we need to end
//                 return res.redirect('/login');
//             }
//         });
//     } else {
//         return res.redirect('/login');
//     }
// });

const { express } = require('../config/lib');
const router = express.Router();

// >>>> =============================================
// Main route
// <<<< =============================================

const { router: outdoorRouter } = require('./outdoor.r');
const { router: indoorRouter } = require('./indoor.r');
// const { authenticate, authorize, passportAuthenticate, passportAuthenticateJWT } = require('../middleware/auth');

router.use(outdoorRouter);

// Require auth request
// router.use(authenticate);
// Place it here make 404 likely not gonna happen
// router.use(passportAuthenticate);
// router.use(passportAuthenticateJWT);

// router.use(authorize);   // For method 1

router.use(indoorRouter);

// >>>> =============================================
// Error
// <<<< =============================================

const error = require('../middleware/error');

router.use(
    error.logDisplay,
    error.xmlhttpError,
    error.predictedErrorPageDisplay,
    error.finalHandler,
);

router.use((req, res, next) => {
    return res.status(404).render('error/error', {
        layout: 'plain',
        name: '404 Not found!',
        message: `Sorry can't find that`,
    }, null);
});

module.exports = { router };
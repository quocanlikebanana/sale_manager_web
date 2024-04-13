const { express } = require('../../config/lib');
const home = require('../../controller/common/home.c');
const router = express.Router();

// https://stackoverflow.com/questions/17744003/get-url-after-in-express-js-middleware-request

router.get('/', home.render);

router.post('/search', home.search);

router.post('/filter', home.filter);

router.post('/page', home.page);

router.post('/detail-product', (req, res, next) => {
});

module.exports = { router };
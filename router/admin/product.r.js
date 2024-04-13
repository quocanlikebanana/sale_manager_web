const { express } = require('../../config/lib');
const router = express();


router.get('/', (req, res, next) => {
    return res.send('product');
});


module.exports = { router };
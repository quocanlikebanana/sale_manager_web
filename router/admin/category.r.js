const { express } = require('../../config/lib');
const auth = require('../../middleware/auth');
const category = require('../../controller/category.c');
const { PERMISSION } = require('../../helper/enum');
const router = express.Router();

router.use(auth.authorize(PERMISSION.admin));

router.get('/', category.render);

router.post('/insert', category.insert);

router.post('/update', category.update);

router.post('/delete', category.delete);

module.exports = { router };
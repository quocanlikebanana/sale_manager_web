const { express } = require('../../config/lib');
const router = express.Router();
const message = require('../../controller/common/message.c');


router.get('/poll', message.poll);

router.post('/new', message.new);

router.post('/cancel', message.cancel);

router.post('/send', message.send);

router.get('/', message.render);


module.exports = { router };
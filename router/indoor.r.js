const { express } = require('../config/lib');
const router = express.Router();

const { router: homeRouter } = require('./common/home.r');
const { router: messageRouter } = require('./common/message.r');
const { router: chatroomRouter } = require('./common/chatroom.r');
const { router: categoryRouter } = require('./admin/category.r');
const { router: productRouter } = require('./admin/product.r');
const { passportAuthenticate } = require('../middleware/auth');

const mdws = [passportAuthenticate];

// Common
router.use('/home', mdws, homeRouter);
router.use('/message', mdws, messageRouter);
router.use('/chatroom', mdws, chatroomRouter);

// Admin
router.use('/category', mdws, categoryRouter);
router.use('/product', mdws, productRouter);


module.exports = { router };

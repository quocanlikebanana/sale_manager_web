const { express } = require('../../config/lib');
const router = express.Router();

const view = 'common/chatroom';

const renderBase = {
    layout: 'main',
    scripts: ['/setting.js', '/page/chatroom.client.js'],
    // scripts: ['/setting.js'],
    header: 'userHeader',
};

router.get('/', (req, res, next) => {
    return res.render(view, renderBase, null);
});



module.exports = { router };
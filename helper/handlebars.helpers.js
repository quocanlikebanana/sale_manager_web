const fs = require('fs');
const path = require('path');

module.exports = {
    // >>>> =============================================
    // Product
    // <<<< =============================================
    // must match the name
    toCurrency: function (float) {
        const numberFormat = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
        const currency = numberFormat.format(float);
        return currency;
    },

    toImageDir: function (id) {
        const dir = `/images/pid/${id}/main.jpg`;
        const checkDir = path.join(__dirname, '..', '/public', dir);
        if (fs.existsSync(checkDir)) {
            return dir;
        }
        else {
            return 'https://pbs.twimg.com/profile_images/425274582581264384/X3QXBN8C.jpeg';
        }
    },
    include: function (elem, list) {
        if (list.indexOf(elem) > -1) {
            return true;
        }
        return false;
    },
    loop: function (from, to, block) {
        let res = '';
        for (let i = from; i <= to; ++i)
            res += block.fn(i);
        return res;
    },
    ifEqual: function (a, b, block) {
        if (a == b) {
            return block.fn(this);
        }
        return block.inverse(this);
    },
};
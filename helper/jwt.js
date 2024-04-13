const jwt = require('jsonwebtoken');

module.exports = {
    toUserJWT(object) {
        const result = jwt.sign(object, 'secret');
        return result;
    },
    toUserObject(token) {
        const result = jwt.decode(token);
        return result;
    },
    vertifyJWT(token) {
        // https://viblo.asia/q/phan-biet-jwtdecode-va-jwtverify-dbZNJ2xnZYM
        const decoded = jwt.verify(token, 'secret');
        return decoded;
    }
}
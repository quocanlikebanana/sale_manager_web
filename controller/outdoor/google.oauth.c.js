const jwt = require('jsonwebtoken');
const { getGoogleOAuthURL, getGoogleOAuthTokens, getGoogleUser } = require('../../service/google');
const User = require('../../model/user.m');
const { toUserJWT } = require('../../helper/jwt');
module.exports = {
    getConsent: (req, res, next) => {
        const ggRedirect = getGoogleOAuthURL();
        return res.redirect(ggRedirect);
    },

    handler: async (req, res, next) => {
        // get google oauth data
        const code = req.query.code;
        const { id_token, access_token } = await getGoogleOAuthTokens(code);
        const user = await getGoogleUser(id_token, access_token);
        const jwtUser = jwt.decode(id_token);
        console.log(user);
        console.log(jwtUser);
        const userObj = {
            ID: user.id,
            Email: user.email,
            Name: user.name,
        };
        const token = toUserJWT(userObj);

        return res.redirect('/');
    }
};
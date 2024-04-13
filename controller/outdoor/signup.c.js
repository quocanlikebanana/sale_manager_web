const bcrypt = require('bcrypt');
const User = require('../../model/user.m');
const { SessionData } = require('../../helper/session.data');
const { ErrorDisplay } = require('../../middleware/error');
const saltRound = 10;

module.exports = {
    render: (req, res, next) => {
        const session = new SessionData(req);
        const dark = session.setting.dark;
        const flash = session.flash;
        session.deleteFlash();
        return res.render('outdoor/signup', {
            layout: 'plain',
            scripts: ['/setting.client.js'],
            dark: dark,
            fullnameError: flash.fullnameError,
            usernameError: flash.usernameError,
            passwordError: flash.passwordError,
            emailError: flash.emailError,
            dobError: flash.dobError,
        }, null);
    },

    auth: async (req, res, next) => {
        const session = new SessionData(req);
        const body = req.body;
        const usernameExists = await User.checkUsernameExists(body.username)
        if (usernameExists) {
            session.flash.usernameError = `Username already exists`;
            return res.redirect('/signup');
        }
        if (!body.password || body.password === '') {
            session.flash.passwordError = `Empty password`;
            return res.redirect('/signup');
        }
        // need to add more checks
        // Sucessfully checked
        body.password = await bcrypt.hash(body.password, saltRound);
        const inserResult = await User.insertUser(body);
        if (!inserResult) {
            next(new ErrorDisplay('Server is not ok...', 500, 'I don\'t feel so good...'));
        }
        return res.redirect('/login');
    }
}
const { Strategy } = require('passport-strategy');
const passport = require('passport');
const { AUTH_ERROR } = require('./enum');
const { SessionData } = require('./session.data');
const { ErrorDisplay } = require('../middleware/error');

class MySuperStrategy extends Strategy {
    constructor(vertify, options) {
        super();
        // Actually, you only need to overwrite the authenticate method, all other attributes are only to support the process
        // But the structure is very basis, and Inject-albe
        this.name = 'super';
        this.vertify = vertify;
        // Property to take the field from request body
        this.usernameField = (options && options.usernameField) ? options.usernameField : 'username';
        this.passwordField = (options && options.passwordField) ? options.passwordField : 'password';
        passport.strategies[this.name] = this;  // Register
        // Can't override defined function because this instance is just a prototype
        // this.fail = function () {
        //     console.log(`test2`);
        // }
    }

    // fail(challenge, status) {
    //     console.log(`test`);
    // }

    authenticate(req, options) {
        const username = req.body[this.usernameField];
        const password = req.body[this.passwordField];
        // Error here should be message (string), if it's not null, its error
        this.vertify(username, password, (error, user) => {
            // const session = new SessionData(req.session);
            if (error) {
                const session = new SessionData(req);
                switch (error) {
                    case AUTH_ERROR.noUser:
                        session.flash.usernameError = `Can't find username`;
                        break;
                    case AUTH_ERROR.wrongPassword:
                        session.flash.passwordError = `Wrong password`;
                        break;
                }
                return this.fail(401);
            }
            if (!user) {
                return this.error(new ErrorDisplay('500 - Authentication failed', 500, ''));
            }
            return this.success(user); // Go to serialize to store and create sessionID  
        });
    }
}

class MyJWTStrategy extends Strategy {
    constructor(vertify, options) {
        super();
        this.name = 'jwt';
        this.vertify = vertify;
        this.jwtcookie = (options && options.jwtcookie) ? options.jwtcookie : 'jwt';
        passport.strategies[this.name] = this;
    }

    authenticate(req, options) {
        const jwt = req.cookies['jwt'];
        this.vertify(jwt, (error, user) => {
            if (error) {
                // return this.error(new ErrorDisplay('500 - Authentication failed', 500, error));
                return this.fail(error, 401);
            }
            if (!user) {
                return this.fail('No user', 401);
            }
            return this.success(user); // Go to serialize to store and create sessionID  
        });
    }
}

module.exports = { MySuperStrategy, MyJWTStrategy };
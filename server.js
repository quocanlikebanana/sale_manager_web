const express = require('express');
const app = express();
const expressHbs = require('express-handlebars');
const session = require('express-session'); // includes cookie
const https = require('https');
const fs = require('fs');
const { HOST, PORT } = require('./config/env');
const hbsHelpers = require('./helper/handlebars.helpers');
const cookieParser = require('cookie-parser');

// >>>> =============================================
// Express reader
// <<<< =============================================

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// >>>> =============================================
// Template - HBS
// <<<< =============================================

app.engine('hbs', expressHbs.engine({
    extname: 'hbs',
    layoutsDir: __dirname + '/view/layout',
    defaultLayout: 'plain',
    partialsDir: __dirname + '/view/partials',
    helpers: hbsHelpers,
}));
app.set('view engine', 'hbs');
app.set('views', './view/page');

app.use(express.static(__dirname + '/view/script'));
app.use(express.static(__dirname + '/view/style'));
app.use(express.static(__dirname + '/public'));

// >>>> =============================================
// Session
// <<<< =============================================

// Split it out for socket io to use
const sessionMiddleware = session({
    resave: false,
    saveUninitialized: false,
    secret: 'angodepchai',
    cookie: { signed: true },
});

app.use(sessionMiddleware);

// >>>> =============================================
// Passport - AUTH
// <<<< =============================================

const { init, passport } = require('./middleware/passport');
init(app);

// >>>> =============================================
// ROUTING
// <<<< =============================================

const { router: mainRouter } = require('./router/main.r');

app.use(mainRouter);

// >>>> =============================================
// HTTPS
// <<<< =============================================

const server = https.createServer({
    key: fs.readFileSync('./_certs/anngosecretkey.key'),
    cert: fs.readFileSync('./_certs/anngosecretcert.cert')
}, app);


// >>>> =============================================
// Socket
// <<<< =============================================

const { chatroom } = require('./service/socketio');
chatroom(server, sessionMiddleware, passport);

// >>>> =============================================
// Run ...
// <<<< =============================================

server.listen(PORT, HOST, () => {
    console.log(`Server is on: ${HOST}:${PORT}`);
});

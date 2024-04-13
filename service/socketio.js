const { Server } = require('socket.io');

// Ver 1:
// // const wrapMiddlewareForSocketIo = middleware => (socket, next) => middleware(socket.request, {}, next);
// io.use(wrapMiddlewareForSocketIo(passport.initialize()));
// io.use(wrapMiddlewareForSocketIo(passport.session()));
// io.use(wrapMiddlewareForSocketIo(passport.authenticate(['jwt'])));

// Ver 2:
// // convert a connect middleware to a Socket.IO middleware
// const wrap = (middleware) => (socket, next) =>
//     middleware(socket.request, {}, next);

// io.use(wrap(sessionMiddleware));
// io.use(wrap(passport.initialize()));
// io.use(wrap(passport.session()));

function chatroom(httpServer, sessionMdw, passport) {
    const io = new Server(httpServer, {});
    io.engine.use(sessionMdw);
    io.engine.use(passport.initialize());   // Needed?
    io.engine.use(passport.session());
    // Now it has the user's data in socket.request.user
    io.on('connection', socket => {
        // NOTE: the socket will automatically connected event if it has not been authenticated (cause we only pass the sessionMdw)
        // console.log(`Sock ID: ${socket.id.substring(0, 5)} connected`);
        // console.log(socket.request.session.passport.user);
        // console.log(socket.request.session.id);
        socket.on('chatroom', data => {
            io.emit('chatroom', `${socket.id.substring(0, 5)} said: ${data}`);
        });
    });
}

// function notification(httpServer) {
//     const io = new Server(httpServer, {});
//     io.on('connection', socket => {
//         console.log(`User: ${socket.id.substring(0, 5)} connected`);
//         socket.on('notification', data => {
//             io.emit('notification', `${socket.id.substring(0, 5)} said: ${data}`);
//         });
//     });
// }

module.exports = { chatroom }
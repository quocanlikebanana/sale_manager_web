// https://stackoverflow.com/questions/72713533/failed-to-resolve-module-specifier-socket-io-client-relative-references-must
// must delete when run
// import { io } from "socket.io-client";

// const socket = io();
const socket = io({ withCredentials: true }); // cors, cross client site

socket.on('chatroom', message => {
    const li = $('<li></li>').text(message);
    $('#displayUL').append(li);
});

$(() => {
    $('#sendBTN').on('click', (ev) => {
        const val = $('#messageTB').val();
        socket.emit('chatroom', val);
        $('#messageTB').val('');
        $('#messageTB').trigger('focus');
    });
});
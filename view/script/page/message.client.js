async function newMessage() {
    await pagePost({}, '/message/new');
}

async function cancelMessage() {
    await pagePost({}, '/message/cancel');
}

async function sendMessage() {
    const receiver = $('#receiverTB').val();
    const message = $('#messageTB').val();
    await pagePost({ receiver, message }, '/message/send');
}

function poll() {
    fetch('https://localhost:3000/message/poll')
        .then(response => response.json())
        .then(conversations => {
            $('#inboxCont').empty();
            for (const conv of conversations) {
                // Should use jquery instead of string like this
                const raw = `<div class="conversationCard card"
                    data-message="${conv.message}">
                    <p>${conv.sender}</p>
                </div>`;
                const conversationDiv = $($.parseHTML(raw));
                conversationDiv.on('click', function (e) {
                    const message = $(this).data("message") ?? "";
                    const sender = $(this).children('p').text();
                    $('#messageTB').text(message);
                    $('#senderText').text(sender);
                });
                $('#inboxCont').append(conversationDiv);
            }
            poll();
        });
}

$(() => {
    $('#newMessageBtn').on('click', newMessage);
    $('#cancelMessageBtn').on('click', cancelMessage);
    $('#sendMessageBtn').on('click', sendMessage);
    $('.conversationCard').on('click', async function (e) {
        const message = $(this).data("message") ?? "";
        const sender = $(this).children('p').text();
        $('#messageTB').text(message);
        $('#senderText').text(sender);
    });
    poll();
});


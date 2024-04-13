$(() => {
    $("#logoutBTN").on('click', function (e) {
        pagePost({}, '/logout');
    });
});
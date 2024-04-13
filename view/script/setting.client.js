$('#darkModeSwitch').on('change', async function () {
    const dark = $('#darkModeSwitch').is(":checked");
    await pagePost({ dark }, '/setting');
});

$(() => {

});
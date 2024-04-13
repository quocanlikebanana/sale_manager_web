const searchProductTB = $('#js-searchProductTB');
const searchProductBTN = $('#js-searchProductBTN');
const categoryCBs = $('.js-categoryCBs');

searchProductBTN.on('click', async function (e) {
    const search = searchProductTB.val();
    await pagePost({ search }, '/home/search');
});

categoryCBs.on('change', async function (e) {
    // $('#filterForm').trigger('submit');  // Quick, but need to redirect
    const checkedCategoryArray = [];
    const formData = $('#filterForm').serializeArray();
    formData.forEach(inputObj => checkedCategoryArray.push(Number(inputObj.value)));
    await pagePost({ checkedCategoryArray }, '/home/filter');
});

$('#js-prevPage').on('click', async () => await toPage('down'));
$('#js-nextPage').on('click', async () => await toPage('up'));
$('.pageNav').on('click', async function (e) {
    await toPage($(this).data('id'));
});

async function toPage(page) {
    await pagePost({ page: page }, '/home/page');
}


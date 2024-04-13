const serverUrl = 'http://localhost:3000';


// Button events:

function updateCategory() {
    const categoryId = $(this).closest("tr").find("td:nth-child(1)").text();
    const categoryName = $(this).closest("tr").find("td:nth-child(2)").text();
    $('#categoryInput').val(categoryName);
    $('#categoryInput').data('id', categoryId);
    $('#updateConfirmButton').attr('style', 'display: none');
}

function deleteCategory() {
    const categoryId = $(this).closest("tr").find("td:nth-child(1)").text();
    deleteAPI(categoryId);
}

function confirmInsert() {
    const categoryName = $('#categoryInput').val();
    if (categoryName === '') return;
    insertAPI(categoryName);
}

function confirmUpdate() {
    const categoryName = $('#categoryInput').val();
    const categoryId = $('#categoryInput').data('id');
    $('#categoryInput').data('id', null);
    $('#updateConfirmButton').attr('style', 'display: none !important');
    updateAPI(categoryId, categoryName);
}

// No need to get list, hbs will render it
// fetch

function insertAPI(categoryName) {
    const refresh = window.location;
    const url = `${serverUrl}/category/insert`;
    fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ CatName: categoryName }),
    });
    window.location = refresh;
}

function updateAPI(categoryId, categoryName) {
    const refresh = window.location;
    const url = `${serverUrl}/category/update`;
    fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            CatID: categoryId,
            CatName: categoryName,
        }),
    })
    window.location = refresh;
}

function deleteAPI(categoryId) {
    const refresh = window.location;
    const url = `${serverUrl}/category/delete`;
    fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            CatID: categoryId,
        }),
    })
    window.location = refresh;
}


// No need to render list, hbs will render it
// fetch

$(() => {
    $('#updateConfirmButton').attr('style', 'display: none !important');
});
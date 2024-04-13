const host = `${window.location.protocol}//${window.location.host}`;

async function pagePost(body, endPoint) {
    const refresh = window.location;
    const response = await fetch(`${host}${endPoint}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (response.status >= 200 && response.status < 300) {
        if (response.redirected) {
            window.location = response.url;
        } else {
            window.location = refresh;
        }
    }
}
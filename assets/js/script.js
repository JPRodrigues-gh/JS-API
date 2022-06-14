const API_KEY = "x5mNehd-lHU3MeeNDDT_hsReHAQ"
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

function processOptions(form) {
    let optArray = [];

    for (let entry of form.entries()) {
        if (entry[0] === "options") {
            optArray.push(entry[1]);
        }
    }
    form.delete("options");

    form.append("options", optArray.join());

    return form;
}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById("checksform")));

    // Test code
    // for (let entry of form.entries()) {
    //     console.log(entry);
    // }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    });
    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayErrors(data) {
    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }
    const resultTitle = document.getElementById("resultsModalTitle");
    const resultContent = document.getElementById("results-content");

    resultTitle.innerText = heading;
    resultContent.innerHTML = results;
    resultsModal.show();
}

async function getStatus(e) {
    /** Concatenate the API URL and KEY using string literals and in the
        format provided JSHINT API documentation for the GET request */
    var keyUrlString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(keyUrlString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    let resultTitle = document.getElementById("resultsModalTitle");
    let resultContent = document.getElementById("results-content");
    let title = "API Key Status";
    let results = `<div>Your key is valid until:</div>`;

    results += `<div class="key-status">${data.expiry}</div>`;
    resultTitle.innerText = title;
    resultContent.innerHTML = results;
    resultsModal.show();

}

function displayException(data) {
    let heading = `An Exception Occurred`;

    results = `<div>The API returned status code ${data.status_code}</div>`;
    results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
    results += `<div>Error text: <strong>${data.error}</strong></div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}
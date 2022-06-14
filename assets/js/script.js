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
        throw new Error(data.error);
    }
}

function displayErrors(data) {
    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        result = `<div class="no_errors">No errors reported!</div>`;
    } else {
        result = `<div>Total errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            result += `<div>At line <span class="line">${error.line}</span>, `;
            result += `column <span class="column">${error.col}</span></div>`;
            result += `<div class="error">${error.error}</div>`;
        }
    }
    const resultTitle = document.getElementById("resultsModalTitle");
    const resultContent = document.getElementById("results-content");

    resultTitle.innerText = heading;
    resultContent.innerHTML = result;
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
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    const resultTitle = document.getElementById("resultsModalTitle");
    const resultContent = document.getElementById("results-content");
    let title = "API Key Status";
    let result = `<div>Your key is valid until:</div>`;

    result += `<div class="key-status">${data.expiry}</div>`;
    resultTitle.innerText = title;
    resultContent.innerHTML = result;
    resultsModal.show();

}
const API_KEY = "x5mNehd-lHU3MeeNDDT_hsReHAQ"
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));

async function getStatus(e) {
    /** Concatenate the API URL and KEY using string literals and in the
        format provided JSHINT API documentation for the GET request */
    var keyUrlString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(keyUrlString);
    
    const data = await response.json();

    if(response.ok) {
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
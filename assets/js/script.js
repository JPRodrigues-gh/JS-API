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
        console.log(data.expiry);
    } else {
        throw new Error(data.error);
    }
}
let data = [];

// Load the JSON data when the page loads
fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
    })
    .catch(error => console.error('Error loading data:', error));

function search() {
    const searchTerm = document.getElementById('searchTerm').value.toLowerCase().trim();
    const resultsList = document.getElementById('results');
    resultsList.innerHTML = '';  // Clear previous results

    if (searchTerm === '') {
        resultsList.innerHTML = '<li>Please enter a search term.</li>';
        return;
    }

    const searchTerms = searchTerm.split(' ');

    const filteredResults = data.filter(item => {
        const yearStr = item.Year ? item.Year.toString() : '';

        return searchTerms.some(term => {
            if (term.includes('-')) {
                const [start, end] = term.split('-').map(Number);
                const itemYear = parseInt(item.Year);
                return itemYear >= start && itemYear <= end;
            }

            return (item.Title && item.Title.toLowerCase().includes(term)) ||
                   (item.Company && item.Company.toLowerCase().includes(term)) ||
                   (yearStr.includes(term)) ||
                   (item.Keywords && item.Keywords.toLowerCase().includes(term));
        });
    });

    if (filteredResults.length === 0) {
        resultsList.innerHTML = '<li>No results found.</li>';
    } else {
        filteredResults.forEach(result => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>Title:</strong> ${result.Title} <br>
                                  <strong>Company:</strong> ${result.Company} <br>
                                  <strong>Year:</strong> ${result.Year} <br>
                                  <strong><a href="${result.Link}" target="_blank">Access Case Study</a></strong>`;
            resultsList.appendChild(listItem);
        });
    }
}

// Function to display a random result
function surpriseMe() {
    const resultsList = document.getElementById('results');
    resultsList.innerHTML = '';  // Clear previous results

    if (data.length === 0) {
        resultsList.innerHTML = '<li>No data available.</li>';
        return;
    }

    // Pick a random item from the data
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomResult = data[randomIndex];

    // Display the random result
    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>Title:</strong> ${randomResult.Title} <br>
                          <strong>Company:</strong> ${randomResult.Company} <br>
                          <strong>Year:</strong> ${randomResult.Year} <br>
                          <strong><a href="${randomResult.Link}" target="_blank">Access Case Study</a></strong>`;
    resultsList.appendChild(listItem);
}

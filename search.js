let data = [];

// Load the JSON data when the page loads
fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
    })
    .catch(error => console.error('Error loading data:', error));

function search() {
    const searchTerm = document.getElementById('searchTerm').value.toLowerCase();
    const resultsList = document.getElementById('results');
    resultsList.innerHTML = '';  // Clear previous results

    if (searchTerm === '') {
        resultsList.innerHTML = '<li>Please enter a search term.</li>';
        return;
    }

    // Search through Title, Company, Year, and Keywords
    const filteredResults = data.filter(item => 
        (item.Title && item.Title.toLowerCase().includes(searchTerm)) ||
        (item.Company && item.Company.toLowerCase().includes(searchTerm)) ||
        (item.Year && item.Year.toString().includes(searchTerm)) ||  // Convert Year to string
        (item.Keywords && item.Keywords.toLowerCase().includes(searchTerm))
    );

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

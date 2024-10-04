let data = [];

// Load the JSON data when the page loads
fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
    })
    .catch(error => console.error('Error loading data:', error));

// Trigger search when the Enter key is pressed
document.getElementById('searchTerm').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent the form from submitting
        search();  // Trigger the search function
    }
});

function search() {
    const searchTerm = document.getElementById('searchTerm').value.toLowerCase();
    const resultsList = document.getElementById('results');
    resultsList.innerHTML = '';  // Clear previous results

    if (searchTerm === '') {
        resultsList.innerHTML = '<li>Please enter a search term.</li>';
        return;
    }

    const filteredResults = data.filter(item => 
        item.Keywords.toLowerCase().includes(searchTerm)
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

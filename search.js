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

    // Split search terms by space to support multi-term search
    const searchTerms = searchTerm.split(' ');

    // Filter results by checking search terms in Title, Company, Year, Keywords, and handling Year ranges
    const filteredResults = data.filter(item => {
        // Convert the Year to a string for searching
        const yearStr = item.Year ? item.Year.toString() : '';

        // Check each search term across all fields
        return searchTerms.every(term => {
            // Check for Year range if the term contains a dash, e.g., "2006-2010"
            if (term.includes('-')) {
                const [start, end] = term.split('-').map(Number);  // Split the range and convert to numbers
                const itemYear = parseInt(item.Year);  // Convert item Year to integer
                return itemYear >= start && itemYear <= end;
            }
            // Otherwise, check the term in all fields (Title, Company, Year, Keywords)
            return (item.Title && item.Title.toLowerCase().includes(term)) ||
                   (item.Company && item.Company.toLowerCase().includes(term)) ||
                   (yearStr.includes(term)) ||
                   (item.Keywords && item.Keywords.toLowerCase().includes(term));
        });
    });

    // Display the results
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

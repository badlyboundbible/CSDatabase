let data = [];
let keywordColumn = '';  // For manually tracking the Keywords column

// Load the CSV data from SharePoint when the page loads
fetch('https://dmail-my.sharepoint.com/personal/dmillar002_dundee_ac_uk/_layouts/15/download.aspx?share=EcgM853u6h5Mnl83NXE7ICQB79gz3WbMgAS1xm4pN74hzA')
    .then(response => response.text())  // Get the CSV data as plain text
    .then(csvText => {
        data = parseCSV(csvText);  // Convert CSV to JSON format
        console.log("Parsed Data: ", data);  // Log the parsed data to inspect it
    })
    .catch(error => console.error('Error loading data from SharePoint:', error));

// Function to parse CSV data into an array of objects (similar to JSON format)
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');  // First row is the header

    headers.forEach((header, index) => {
        if (header.trim().toLowerCase() === 'keywords') {
            keywordColumn = header.trim().toLowerCase();  // Track the keywords column explicitly
        }
    });

    const rows = lines.slice(1);  // All subsequent rows are data

    return rows.map(row => {
        const values = row.split(',');
        const result = {};
        headers.forEach((header, index) => {
            result[header.trim().toLowerCase()] = values[index].trim();  // Assign values to corresponding headers
        });
        return result;
    });
}

function search() {
    const searchTerm = document.getElementById('searchTerm').value.toLowerCase().trim();
    const resultsList = document.getElementById('results');
    resultsList.innerHTML = '';  // Clear previous results

    if (searchTerm === '') {
        resultsList.innerHTML = '<li>Please enter a search term.</li>';
        return;
    }

    // Split the search term into multiple terms
    const searchTerms = searchTerm.split(' ');

    // Filter the results based on whether any search term matches
    const filteredResults = data.filter(item => {
        // Convert the entire row into a single string for matching, including explicitly checking the Keywords column
        const rowData = Object.values(item).join(' ').toLowerCase();
        const keywordData = item[keywordColumn] ? item[keywordColumn].toLowerCase() : '';
        const yearStr = item.year ? item.year.toString() : '';

        // Return true if any of the search terms match (use some())
        return searchTerms.some(term => {
            // Handle date range search (e.g., "2000-2020")
            if (term.includes('-')) {
                const [startYear, endYear] = term.split('-').map(Number);  // Split into start and end years
                const itemYear = parseInt(item.year);  // Convert the item year to an integer
                return !isNaN(itemYear) && itemYear >= startYear && itemYear <= endYear;
            }

            // If it's not a date range, check if the term matches any part of the row, keywords, or year
            return rowData.includes(term) || keywordData.includes(term) || yearStr.includes(term);
        });
    });

    // Display the results
    if (filteredResults.length === 0) {
        resultsList.innerHTML = '<li>No results found.</li>';
    } else {
        filteredResults.forEach(result => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>Title:</strong> ${result.title || ''} <br>
                                  <strong>Company:</strong> ${result.company || ''} <br>
                                  <strong>Year:</strong> ${result.year || ''} <br>
                                  <strong><a href="${result.link || '#'}" target="_blank">Access Case Study</a></strong>`;
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
    listItem.innerHTML = `<strong>Title:</strong> ${randomResult.title || ''} <br>
                          <strong>Company:</strong> ${randomResult.company || ''} <br>
                          <strong>Year:</strong> ${randomResult.year || ''} <br>
                          <strong><a href="${randomResult.link || '#'}" target="_blank">Access Case Study</a></strong>`;
    resultsList.appendChild(listItem);
}

// Add event listener for the "Surprise me!" button
document.getElementById('surpriseBtn').addEventListener('click', surpriseMe);

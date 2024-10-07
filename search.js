let data = [];
let keywordColumn = '';

// Load the CSV data from SharePoint when the page loads
fetch('https://dmail-my.sharepoint.com/personal/dmillar002_dundee_ac_uk/_layouts/15/download.aspx?share=EcgM853u6h5Mnl83NXE7ICQB79gz3WbMgAS1xm4pN74hzA')
    .then(response => response.text())  // Get the CSV data as plain text
    .then(csvText => {
        data = parseCSV(csvText);  // Convert CSV to JSON format
        logHeaders(data);  // Log headers and first item to verify fields
    })
    .catch(error => console.error('Error loading data from SharePoint:', error));

// Function to parse CSV data into an array of objects (similar to JSON format)
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    let headers = lines[0].split(',');  // First row is the header

    // Trim and normalize headers to avoid issues with spacing or case
    headers = headers.map(header => header.trim().toLowerCase());

    // Identify the correct Keywords column (look for variations)
    keywordColumn = headers.includes('keywords') ? 'keywords' : headers.find(header => header.includes('keyword'));

    const rows = lines.slice(1);  // All subsequent rows are data

    return rows.map(row => {
        const values = row.split(',');
        const result = {};
        headers.forEach((header, index) => {
            result[header] = values[index] ? values[index].trim() : '';  // Assign values to corresponding headers
        });
        return result;
    });
}

// Function to log headers and first item to inspect field names
function logHeaders(data) {
    if (data.length > 0) {
        const firstItem = data[0];
        console.log("Headers and First Item:", firstItem);
        console.log("Keywords Field Detected As:", keywordColumn);
        console.log("Keywords Field Data:", firstItem[keywordColumn]);
    } else {
        console.log("No data available.");
    }
}

function search() {
    const searchTerm = document.getElementById('searchTerm').value.toLowerCase().trim();
    const resultsList = document.getElementById('results');
    resultsList.innerHTML = '';  // Clear previous results

    if (searchTerm === '') {
        resultsList.innerHTML = '<li>Please enter a search term.</li>';
        return;
    }

    const searchTerms = searchTerm.split(' ');  // Split search terms by spaces

    // Filter the results based on whether any part of the term matches in any field
    const filteredResults = data.filter(item => {
        const yearStr = item.year ? item.year.toString() : '';

        // Check if ANY search term matches any field (partial match)
        return searchTerms.some(term => {
            if (term.includes('-')) {
                const [start, end] = term.split('-').map(Number);  // Split the range and convert to numbers
                const itemYear = parseInt(item.year);
                return itemYear >= start && itemYear <= end;
            }

            // Check for partial matches in all relevant fields (Title, Company, Year, Keywords)
            return (item.title && item.title.toLowerCase().includes(term)) ||
                   (item.company && item.company.toLowerCase().includes(term)) ||
                   (yearStr.includes(term)) ||
                   (item[keywordColumn] && item[keywordColumn].toLowerCase().includes(term));  // Dynamically check Keywords column
        });
    });

    // Display the results
    if (filteredResults.length === 0) {
        resultsList.innerHTML = '<li>No results found.</li>';
    } else {
        filteredResults.forEach(result => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>Title:</strong> ${result.title} <br>
                                  <strong>Company:</strong> ${result.company} <br>
                                  <strong>Year:</strong> ${result.year} <br>
                                  <strong><a href="${result.link}" target="_blank">Access Case Study</a></strong>`;
            resultsList.appendChild(listItem);
        });
    }
}

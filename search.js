let data = [];

// Load the CSV data from SharePoint and force UTF-8 encoding
fetch('https://dmail-my.sharepoint.com/personal/dmillar002_dundee_ac_uk/_layouts/15/download.aspx?share=EcgM853u6h5Mnl83NXE7ICQB79gz3WbMgAS1xm4pN74hzA')
    .then(response => response.text())  // Force text encoding
    .then(csvText => {
        data = parseCSV(csvText);  // Convert CSV to JSON format
    })
    .catch(error => console.error('Error loading data from SharePoint:', error));

// Function to parse CSV data into an array of objects (similar to JSON format)
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');  // First row is the header
    const rows = lines.slice(1);  // All subsequent rows are data

    return rows.map(row => {
        const values = row.split(',');
        const result = {};
        headers.forEach((header, index) => {
            result[header.trim()] = values[index].trim();  // Assign values to corresponding headers
        });
        return result;
    });
}

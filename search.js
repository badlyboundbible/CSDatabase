// Sample data that mimics your JSON file
const data = [
    {
        "Title": "Nike’s Dream Crazy Campaign – Cause Marketing and Brand Activism",
        "Company": "Nike",
        "Year": "2018",
        "Keywords": "Nike, brand activism, cause marketing",
        "Link": "https://example.com/nike-dream-crazy"
    },
    {
        "Title": "Coca-Cola’s Share a Coke Campaign – Personalization at Scale",
        "Company": "Coca-Cola",
        "Year": "2011",
        "Keywords": "Coca-Cola, personalization, global marketing",
        "Link": "https://example.com/share-a-coke"
    }
    // Add more case studies here...
];

function search() {
    // Get the search term from the input field
    const searchTerm = document.getElementById('searchTerm').value.toLowerCase();

    // Filter the data based on the search term
    const filteredResults = data.filter(item => 
        item.Keywords.toLowerCase().includes(searchTerm)
    );

    // Display the results
    const resultsList = document.getElementById('results');
    resultsList.innerHTML = ''; // Clear previous results

    if (filteredResults.length === 0) {
        resultsList.innerHTML = '<li>No results found</li>';
    } else {
        filteredResults.forEach(result => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>Title:</strong> ${result.Title} <br>
                                  <strong>Company:</strong> ${result.Company} <br>
                                  <strong>Year:</strong> ${result.Year} <br>
                                  <strong>Link:</strong> <a href="${result.Link}">Link</a>`;
            resultsList.appendChild(listItem);
        });
    }
}

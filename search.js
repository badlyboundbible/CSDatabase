let data = [];

fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
    })
    .catch(error => console.error('Error loading data:', error));

function search() {
    const searchTerm = document.getElementById('searchTerm').value.toLowerCase();

    const filteredResults = data.filter(item => 
        item.Keywords.toLowerCase().includes(searchTerm)
    );

    const resultsList = document.getElementById('results');
    resultsList.innerHTML = '';

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

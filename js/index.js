const consoleLog = true;
// const url = document.getElementById("query-link")
const url = 'https://restcountries.com/v3.1/region/europe?fields=name,capital,population,currencies,subregion,languages'

async function refill_Information() {
    const response = await fetch(url);
    let data = await response.json();
    if (consoleLog)
        console.log(data);
    if (response) {
        showLoading();
    }
    showCountries(data);
}

function showCountries(data) {
    let countries = []
    // Get N random countries from the data
    for (let i = 0; i < document.getElementById("number-select").value; i++) {
        let index = 0;
        do {
            index = Math.floor(Math.random() * data.length)
        } while (countries.includes(data[index]))
        countries.push(data[index])
    }
    // Sort countries alphabetically by their name
    countries = countries.sort((a, b) => {
        return a.name.official.localeCompare(b.name.official)
    })
    if (consoleLog)
        console.log(countries);
    // For every country make a table row
    let created_body = ""
    for (let i=0; i<countries.length; i++) {
        created_body += `<tr>
        <td>${countries[i].name.official}</td>
        <td>${countries[i].capital}</td>
        <td>${countries[i].population}</td>
        <td>${countries[i].currencies.toString()}</td>
        <td>${countries[i].subregion}</td>
        <td>${countries[i].languages.toString()}</td>
        </tr>` //FixMe
    }
    if (consoleLog)
        console.log(created_body);
    document.getElementById("countries-body").innerHTML = created_body;
}

function showLoading() {
    //loading visibility true
    //ToDo
}

function hideLoading() {
    //loading visibility false
}
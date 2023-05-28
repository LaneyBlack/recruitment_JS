const consoleLog = true;

// const url = 'https://restcountries.com/v3.1/region/europe?fields=name,capital,population,currencies,subregion,languages'

async function refill_Information() {
    // If selects have values then
    if (document.getElementById("continent-select").value !== 'none') {
        showLoading();
        // Get Configuration
        const config = await fetchData("./tsconfig.json")
            .catch(error => console.error("Fetch Config Error", error));

        // Build URL
        let queryURL = config.url;
        queryURL += "/region/" + document.getElementById("continent-select").value
        queryURL += "?fields="
        for (let i = 0; i < config.tableConfig.fields.length; i++) {
            queryURL += config.tableConfig.fields[i] + ","
        }
        if (consoleLog)
            console.log(queryURL);

        // Then try to get data using created URL
        try {
            // let data = await fetchData(queryURL);
            let data = await fetchData("./test.json"); // local file insertion -----------------------------------
            if (consoleLog)
                console.log(data);
            showCountries(data, config.tableConfig);
        } catch (e) {
            alert("Countries Rest API service is unavailable!\n" +
                "Check - https://restcountries.com/");
            console.log("Error:", e);
        }
        hideLoading();
    } else {
        //ToDo on screen
        alert("Please select values!");
    }
}

async function fetchData(filePath) {
    const response = await fetch(filePath);
    return await response.json();
}

function showCountries(data, tableConfig) {
    const columns = tableConfig.fields;
    let countries = [];
    // Get N random countries from the data
    for (let i = 0; i < document.getElementById("number-range").value; i++) {
        let index = 0;
        do {
            index = Math.floor(Math.random() * data.length);
        } while (countries.includes(data[index]));
        countries.push(data[index]);
    }
    // Sort countries alphabetically by their name
    countries = countries.sort((a, b) => {
        return a.name.official.localeCompare(b.name.official);
    });
    if (consoleLog)
        console.log(countries);
    // For every country make a table row
    let created_body = "";
    for (let i = 0; i < countries.length; i++) {
        //Create table row
        let country = countries[i];
        created_body += "<tr>";
        // For every column
        for (let j = 0; j < columns.length; j++) {
            let countryColumn = country[columns[j]];
            if (countryColumn) { // If there is info
                created_body += "<td>"
                if (tableConfig[columns[j]]) { // If this column config exists then
                    let columnConfig = tableConfig[columns[j]];
                    for (let k = 0; k < columnConfig.length; k++) {
                        created_body += countryColumn[columnConfig[k]];
                    }
                } else if (countryColumn[0] && typeof countryColumn !== "string") { // If is a collection and not string
                    if (typeof countryColumn[0] === "object") // If collection of objects
                        for (let k = 0; k < countryColumn.length; k++) {
                            created_body += countryColumn[k]["name"];
                            if (k < countryColumn.length - 1)
                                created_body += ", ";
                        }
                    else // if collection of not objects
                        for (let k = 0; k < countryColumn.length; k++) {
                            created_body += countryColumn[k];
                            if (k < countryColumn.length - 1)
                                created_body += ", ";
                        }
                } else
                    created_body += countries[i][columns[j]];
                created_body += "</td>";
            } else { // If NF
                created_body += "<td>NotFound</td>";
            }
        }
        created_body += "</tr>";
    }
    if (consoleLog)
        console.log(created_body);
    document.getElementById("countries-body").innerHTML = created_body;
}

function showLoading() {
    document.getElementById("loading").style.display = "block"
}

function hideLoading() {
    document.getElementById("loading").style.display = "none";
}
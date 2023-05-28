async function getInformation() {
    // If selects have values then
    if (document.getElementById("continent-select").value !== 'none') {
        showLoadingMsg();
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
        if (config.consoleLog)
            console.log(queryURL);

        // Then try to get data using created URL
        try {
            // let data = await fetchData(queryURL);
            let data = await fetchData(config.testfile); // local file insertion -----------------------------------
            fulfillCountryTable(data, config.tableConfig, config.consoleLog);
        } catch (e) {
            alert("Countries Rest API service is unavailable!\n" +
                "Check - https://restcountries.com/");
            console.error("Error:", e);
        }
        hideLoadingMsg();
    } else {
        alert("Please select a continent!");
    }
}

async function fetchData(filePath) {
    const response = await fetch(filePath);
    return await response.json();
}

function fulfillCountryTable(data, tableConfig, consoleLog) {
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
    document.getElementById("countries-body").innerHTML = created_body;
}

function showLoadingMsg() {
    document.getElementById("loading").style.display = "block"
}

function hideLoadingMsg() {
    document.getElementById("loading").style.display = "none";
}

async function setCountriesHeader() {
    const config = await fetchData("./tsconfig.json")
        .catch(error => console.error("Fetch Config Error", error));
    let created_header = "<tr>";
    for (let i = 0; i < config.tableConfig.headers.length; i++) {
        created_header += "<th>" + config.tableConfig.headers[i] + "</th>";
    }
    created_header += "</tr>";
    if (config.consoleLog)
        console.log(created_header);
    document.getElementById("countries-header").innerHTML = created_header;
}
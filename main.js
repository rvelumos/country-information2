const countryList = document.getElementById('country-overview-list');
const countryInfo = document.getElementById('countries');
const button = document.getElementById('search-btn');
const searchBar = document.getElementById('search-bar');

button.addEventListener('click', getCountryData);
searchBar.addEventListener('keyup', setQuery);
const selectElement = document.querySelector('.sort');

let query = '';

function setQuery(e) {
    query = e.target.value;
    if (e.key === "Enter") {
        getCountryData();
    }
}

async function getCountryData() {
    searchBar.value = '';

    const errorMessage = document.getElementById('error-field');
    errorMessage.textContent = '';

    const oldResult = document.getElementById('country');

    if (oldResult) {
        countryInfo.removeChild(oldResult);
    }

    try {
        const result = await axios.get(`https://restcountries.eu/rest/v2/name/${query}?fullText=true`);
        const countryDetails = result.data[0];

        const country = document.createElement('div');
        country.setAttribute('id', 'country');

        const flag = document.createElement('img');
        flag.setAttribute('src', countryDetails.flag);
        country.appendChild(flag);

        const countryName = document.createElement('h1');
        countryName.textContent = countryInfo.name;
        country.appendChild(countryName);

        const population = document.createElement('span');
        population.textContent = `${countryDetails.name} is situated in ${countryDetails.subregion}. It has a population of ${countryDetails.population} people.`;
        country.appendChild(population);

        const capital = document.createElement('span');
        capital.textContent = `The capital is ${countryDetails.capital} and you can pay with ${createCurrencyDescription(countryDetails.currencies)}`;
        country.appendChild(capital);

        const languages = document.createElement('span');
        languages.textContent = createLanguageDescription(countryDetails.languages);
        country.appendChild(languages);

        countryInfo.appendChild(country);
    } catch(e) {
        errorMessage.textContent = `${query} doesn't exist!`;
    }
}

function createLanguageDescription(languages) {
    let output = 'They speak ';

    for (let i = 0; i < languages.length; i++) {

        if (i === languages.length - 1) {
            return output = output + languages[i].name;
        }

        if (languages.length === 1 || i === languages.length - 2) {
            output = output + languages[i].name;
        }else {
            output = output + languages[i].name + ", ";
        }
    }

    return output;
}

function createCurrencyDescription(currencies) {
    let output = 'and you can pay with ';

    if (currencies.length - 1 === 2) {
        return output + `${currencies[0].name} and ${currencies[1].name}'s. `;
    }

    return output + `${currencies[0].name}'s. `;
}

async function getAllCountries(order) {
    countryList.innerHTML="";
    try {
        const result = await axios.get('https://restcountries.eu/rest/v2/all');
        const { data } = result;

            if(order==='asc') {
                data.sort((a, b) => {
                    return a.population - b.population;
                });
            } else if (order==='desc') {
                data.sort((a, b) => {
                    return b.population - a.population;
                });
            } else {
                return;
            }

        data.map((country) => {
            const { flag, name, region, population } = country;

            const countryContainer = document.createElement('li');
            countryContainer.setAttribute('class', 'country-info');

            const flagItem = document.createElement('img');
            flagItem.setAttribute('src', flag);
            flagItem.setAttribute('class', 'flag');

            countryContainer.appendChild(flagItem);

            const countryNameElement = document.createElement('span');
            countryNameElement.textContent = name;
            countryNameElement.setAttribute('class', getRegionClass(region));

            countryContainer.appendChild(countryNameElement);

            const showPopulation = document.createElement('p');
            showPopulation.setAttribute('class', 'population-dropdown');
            showPopulation.textContent = `Has a population of ${formatHighNumber(population)} people`;
            countryContainer.appendChild(showPopulation);

            countryContainer.addEventListener('click', () => {
                toggleVisibility(showPopulation);
            });

            countryList.appendChild(countryContainer);
        });

    } catch(e) {
        const errorContainer = document.getElementById('error-container');
        errorContainer.textContent= `Fout bij ophalen gegevens, controleer de verbinding!`;
    }
}
selectElement.addEventListener('change', (event) => {
    getAllCountries(event.target.value);
});

function toggleVisibility(populationElement) {
    populationElement.classList.toggle('visible');
}

function formatHighNumber(population) {
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getRegionClass(currentRegion) {
    switch (currentRegion) {
        case 'Africa':
            return 'blue';
        case 'Americas':
            return 'green';
        case 'Asia':
            return 'red';
        case 'Europe':
            return 'yellow';
        case 'Oceania':
            return 'purple';
        default:
            return 'default';
    }
}
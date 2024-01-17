const countriesContainer = document.querySelector(".countries-container");
const inputSearch = document.getElementById("inputSearch");
const inputRange = document.getElementById("inputRange");
const rangeValue = document.getElementById("rangeValue");
const sortByName = document.getElementById("alpha");
const sortCroissant = document.getElementById("minToMax");
const sortDecroissant = document.getElementById("maxToMin");
let countries = [];
let searchCountries = [];
let slicedCountries = [];

// Récupérer les données de l'API
const getData = async () => {
  await fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then((data) => (countries = data));
};

// Fonction d'affichage des pays
const displayCountries = (countries) => {
  const countriesHTML = countries
    .map(
      (country) => `
        <div class="country-card">
        <img src="${country.flags.svg}" alt="flag" class="country-flag">
        <div class="country-infos">
            <h3 class="country-name">${country.name.common}</h3>
            <p class="country-capital">${country.capital}</p>
            <p class="country-region">Population : ${country.population.toLocaleString()}</p>
        </div>
        </div>
    `
    )
    .join("");

  countriesContainer.innerHTML = countriesHTML;
};

// Au chargement afficher les pays
window.addEventListener("load", async () => {
  await getData();
  searchCountries = countries.slice(0, inputRange.value);
  triDecroissant(searchCountries);
});

// Fonction de tri croissant
function triCroissant(x) {
  x.sort((a, b) => a.population - b.population);
  getData(x);
  displayCountries(x);
}

// Fonction de tri décroissant
function triDecroissant(x) {
  x.sort((a, b) => b.population - a.population);
  getData(x);
  displayCountries(x);
}

// Fonction de tri par ordre alphabétique
function triAlpha(x) {
  x.sort((a, b) => {
    if (a.name.common < b.name.common) {
      return -1;
    }
    if (a.name.common > b.name.common) {
      return 1;
    }
    return 0;
  });
  getData(x);
  displayCountries(x);
}

// Gérer la recherche par nom de pays (méthode filter())
inputSearch.addEventListener("input", (e) => {
  const inputValue = e.target.value;

  searchCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(inputValue.toLowerCase())
  );
  getData(searchCountries);
  displayCountries(searchCountries);

  inputRange.max = searchCountries.length;
  inputRange.value = searchCountries.length;
  rangeValue.textContent = searchCountries.length;
});

// Gérer le range pour afficher le nombre de pays
inputRange.addEventListener("change", (e) => {
  const inputRValue = e.target.value;
  rangeValue.textContent = inputRValue;

  slicedCountries = searchCountries.slice(0, inputRValue);

  getData(slicedCountries);
  displayCountries(slicedCountries);
});

// Gérer le tri par ordre alphabétique (méthode sort())
sortByName.addEventListener("click", () => {
  if (searchCountries.length > inputRange.value) {
    triAlpha(slicedCountries);
  } else if (searchCountries.length == inputRange.value) {
    triAlpha(searchCountries);
  }
});

// Gérer le tri par ordre croissant de population (méthode sort())
sortCroissant.addEventListener("click", () => {
  if (searchCountries.length > inputRange.value) {
    triCroissant(slicedCountries);
  } else if (searchCountries.length == inputRange.value) {
    triDecroissant(searchCountries);
  }
});

// Gérer le tri par ordre décroissant de population (méthode sort())
sortDecroissant.addEventListener("click", () => {
  if (searchCountries.length > inputRange.value) {
    triDecroissant(slicedCountries);
  } else if (searchCountries.length == inputRange.value) {
    triDecroissant(searchCountries);
  }
});

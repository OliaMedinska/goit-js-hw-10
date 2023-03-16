import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from "lodash.debounce"
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector("#search-box")
const countryList = document.querySelector(".country-list")
const countryInfo = document.querySelector(".country-info")

searchBox.addEventListener("input", debounce(() => {
    const inputValue = searchBox.value.trim();

    if (inputValue === "") {
        countryList.innerHTML = ""
        countryInfo.innerHTML = ""

        return
    }

    fetchCountries(inputValue)
        .then(data => {
            if (data.length > 10) {
            countryList.innerHTML = ""
        countryInfo.innerHTML = ""
            Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
            return;
        }

        if (data.length === 1) {
            console.log(data)
            countryList.innerHTML = ""

            const markup = data.map(item => {
            return `<div class="country-info__name-box">
       <img src="${item.flags.svg}" alt="${item.flags.alt}" class="country-info__icon">
        <p class="country-info__name">${item.name.official}</p>
      </div>
      <ul class="info-list">
        <li class="info-list__item">
          <p class="info-list__text">
            <span class="info-list__key">Capital:</span>
            <span class="info-list__value">${item.capital[0]}</span>
          </p>
        </li>
        <li class="info-list__item">
          <p class="info-list__text">
            <span class="info-list__key">Population:</span>
            <span class="info-list__value">${item.population}</span>
          </p>
        </li>
        <li class="info-list__item">
          <p class="info-list__text">
            <span class="info-list__key">Languages:</span>
            <span class="info-list__value">${Object.values(item.languages)}</span>
          </p>
        </li>
      </ul>`
            }).join("");
            countryInfo.innerHTML = markup;

            return;
        }

        console.log(data)

        countryInfo.innerHTML = ""

        const markup = data.map(item => {
            return `<li class="country-list__item">
        <img src="${item.flags.svg}" alt="${item.flags.alt}" class="country-list__image">
        <p class="country-list__text">${item.name.official}</p>
      </li>`
        }).join("");

        countryList.innerHTML = markup;
        

    })
        .catch(() => {
            countryList.innerHTML = ""
        countryInfo.innerHTML = ""
            Notiflix.Notify.failure("Oops, there is no country with that name");
    })
}, DEBOUNCE_DELAY))
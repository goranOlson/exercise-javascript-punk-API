/* ###### Imports ###### */
import {
    BASE_URL,
    MAX_SEARCH,
    STORAGE_NAME,
    STORE_SEARCH,
    mainProduct,
    productData,
    display,
    form,
    searchResults,
    logotype,
    iconHome,
    iconSearch,
    seeMoreButton,
    randomButton,
    arrowPrevious,
    arrowNext,
    loader
} from './constants.js';

let actPage = 0;
let searchString = '';


/* ###### Init system ###### */
const initData = getLocalStorageData();
// console.log('initData:', initData);

const view = (initData) ? initData[0] : 'product';
// console.log('view: ' + view);

switch (view) {
    case 'data':  // Product details
        const prodId = (initData[1]) ? initData[1] : 0;
        showProduct(prodId);
        break;
    case 'product':  // Product card
        showProduct();
        break;
    case 'search':  // Search
        searchString = (initData[1]) ? initData[1] : '';
        actPage = (initData[2]) ? initData[2] : 0;
        displaySearch();
        showSearchResult(actPage);
        break;
    default:
        // console.error('Bad view');
        showProduct();
        break;
}

/* ###### Set listener ###### */
mainProduct.addEventListener('click', (event) => {
    if (event.target.tagName === "A") {
        event.preventDefault();
        event.stopPropagation();

        showProduct( event.target.getAttribute('data-id') );
    }
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    showSearchResult();
});

searchResults.addEventListener('click', (event) => {
    const target = event.target; 

    if (target.classList.contains('link')) {  // Click on link?        
        const activeLink = searchResults.querySelector('.link.active');  // inactivate previous link
        if (activeLink) {
            activeLink.classList.remove('active');
        }
        target.classList.add('active');  // active new link

        showProduct(target.dataset.id);
    }
});

logotype.addEventListener('click', showProduct);
iconHome.addEventListener('click', showProduct);
iconSearch.addEventListener('click', displaySearch);
randomButton.addEventListener('click', showProduct);
arrowPrevious.addEventListener('click', clickPreviousPage);
arrowNext.addEventListener('click', clickNextPage);

if (seeMoreButton) {  // IF product is shown - it's a link
    seeMoreButton.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}




/* ###### Functions ###### */
function getLocalStorageData() {
    // STORAGE_NAME: 
    // ['search', [searchString], [page]] - search with search and page
    // ['data', 102] - more info about certain product
    // ['product'] - random product 

    const arr = JSON.parse( localStorage.getItem(STORAGE_NAME) );

    return arr;
}

async function showProduct(prodId = 0) {
    // console.log(`--> showProduct(${prodId})`);
    loader.classList.add('active');
    
    let url = BASE_URL + "/";  // "https://api.punkapi.com/v2/beers/";
    url += (prodId >= 1) ? prodId : "random";

    // Fetch data for prodId or random
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (prodId > 0) {
            displayProduct(data[0], prodId);  // Show detailed data
            localStorage.setItem( STORAGE_NAME, JSON.stringify(['data', prodId]) );
        } else {
            displayProductCard(data[0]);  // Show card
            localStorage.setItem( STORAGE_NAME, JSON.stringify(['product']) );
        }
    } catch (error) {
        console.error('Error: ', error);
    } finally {
        loader.classList.remove('active');
    }

}


function displayProductCard(product) {
    // console.log(`--> displayProduct(product) => ${product.name}`);
    // console.log('product:', product);

    const imagePath = (product.image_url) ? product.image_url : '';  // image is not always provided
        
    // Show random as card
    let articleInner = `
            <img src="${imagePath}" alt="${product.name}">
            <div class="card-content">
                <h4 title="${product.name}">${product.name}</h4> 
                <p>${product.tagline}</p> 
                <p>${product.abv}% alcohol</p> 
                <p>
                    <a href="" data-id="${product.id}" title='Se more about this beer'>See More <i class="fas fa-play"></i></a>
                </p>
            </div>`;
    mainProduct.innerHTML = articleInner;

    scrollToTop();
    switchView('product');
}

function displayProduct(product, prodId = 0) {
    // console.log(`--> displayProduct(product, ${prodId})`);
    // console.log('product:', product);
    
    if (prodId >= 1) {  // Show selected product
        const imagePath = (product.image_url) ? product.image_url : '';  // Not always present
        const volume = product.volume.value + ' ' + product.volume.unit;
        const alcohol = product.abv + "%";
        const hops = extractObjectNames(product.ingredients.hops);
        const ingredients = Object.keys(product.ingredients);
        const foodPairing = Object.values(product.food_pairing);

        let article = `
                <img src="${imagePath}" alt="${product.name}">
                <div class="card-content">
                    <h4 title="${product.name}">${product.name}</h4> 
                    <div class="list">
                        <div>${product.description}</div>
                        <div>
                            <div class="label">Ingredients:</div>
                            ${ingredients.join(', ')}
                        </div>
                        <div>
                            <div class="label">Hops:</div>
                             ${hops.join(', ')}
                        </div>
                        <div>
                            <div class="label">Food pairing:</div>
                            ${foodPairing.join(',')}
                        </div>
                        <div>
                            <div class="label">Brewers tips:</div>
                            ${product.brewers_tips}
                        </div>
                        <div>
                            <div class="label">Details:</div>
                            <div class="spread">
                                <span>Alcohol by volume</span>
                                <span>${product.abv}%</span>
                            </div>
                            <div class="spread">
                                <span>Volume</span>
                                <span>${volume}</span>
                            </div>
                        </div>
                    </div>
                </div>`;
        productData.innerHTML = article;

        scrollToTop();
        switchView('data');
    }
}

function clickPreviousPage() {
    if (searchResults.children.length && !arrowPrevious.classList.contains('inactive') ) {
        showSearchResult(actPage - 1);
    }
}

function clickNextPage() {  
    if (searchResults.children.length && !arrowNext.classList.contains('inactive') ) {
        showSearchResult(actPage + 1);
    }
}

function updateSearchNav(page = 0, more = false) {  // actPage, more
    const searchNavigaton = document.querySelector('.search-navigation');  // buttons under search-result
    
    if (page > 0) {
        searchNavigaton.classList.add('active');
        if (page > 1) {
            searchNavigaton.children[0].classList.remove('inactive');
        }
        searchNavigaton.children[1].innerHTML = page;
        if (more) {
            searchNavigaton.children[2].classList.remove('inactive');
        }
    }
    else {
        searchResults.innerHTML = '';  // Empty results
        searchNavigaton.classList.remove('active');  // Inactivate search navigation
        searchNavigaton.children[0].classList.add('inactive');
        searchNavigaton.children[1].innerHTML = 0;
        searchNavigaton.children[2].classList.add('inactive');
    }
}

async function showSearchResult(newPageNbr = 0) {
    let hasMore = false;
    const input = form.querySelector('input');

    updateSearchNav();  // Empty previous result
    loader.classList.add('active');

    if (newPageNbr > 0) {  // Previous/next page
        input.value = searchString;  // Set input to remove changes
    }
    else {  // New search
        searchString = input.value.trim();
        newPageNbr = 1;
    }
    if (searchString) {
        const data = await fetchSearchResult(newPageNbr, searchString);  // Get search results
        // console.log('- got data: ', data);

        if (data) {  // Check if there are more search results...
            hasMore = await isMoreResults(searchString, newPageNbr);  // Get data for navigations arrows
        }
        displaySearchResults(data);  // Show result
        updateSearchNav(newPageNbr, hasMore);  // Update page navigation
    }

    loader.classList.remove('active');  // Hide loader

    actPage = newPageNbr;  // Store page number global

    // Store data
    localStorage.setItem( STORAGE_NAME, JSON.stringify([STORE_SEARCH, searchString, newPageNbr]) );
}

async function fetchSearchResult(newPageNbr, searchString) {
    let data;
    let url = BASE_URL + `?page=${newPageNbr}&per_page=${MAX_SEARCH}&beer_name=${searchString}`;
    // console.log('url: ' + url);

    try {
        const response = await fetch(url);
        data = await response.json();
        // console.log('data: ', data);
    } catch (error) {
        console.error('Error: ', error);
    }

    return data;
}

async function isMoreResults(searchString, pageNbr) {
    // console.log(`--> isMoreResults(${searchString}, ${pageNbr})`);
    let hasMore = false;
    /*  // page = (pageNbr * MAX_SEARCH) + 1
        pageNbr 1: https://api.punkapi.com/v2/beers?page=11&per_page=1&beer_name=beer
        
        pageNbr 2: https://api.punkapi.com/v2/beers?page=21&per_page=1&beer_name=beer
    */

    const nbr = pageNbr * MAX_SEARCH + 1;  // Create fictive page number
    const url = BASE_URL + `?page=${nbr}&per_page=1&beer_name=${searchString}`;

    if (pageNbr < actPage && pageNbr >= 0) {  // Previous page
        hasMore = true;
    }
    else {
        const nbr = pageNbr * MAX_SEARCH + 1;  // Create fictive page number
        const url = BASE_URL +  `?page=${nbr}&per_page=1&beer_name=${searchString}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            hasMore = (data.length > 0) ? true : false;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return hasMore;
}

function displaySearch(arr = undefined) {
    localStorage.setItem( STORAGE_NAME, JSON.stringify([STORE_SEARCH, searchString, 1]) );
    switchView('search');
    if (searchString) {
        document.querySelector('form input').value = searchString;
    }
    scrollToTop();
}

function displaySearchResults(results) {
    // console.log(`--> displaySearchResults(${results.length})`);
    for (let i = 0; i < results.length; i++) {
        const item = results[i];
        const element = `<div class="link" data-id="${item.id}">${item.name}</div>`;
        searchResults.insertAdjacentHTML('beforeend', element);
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
    });
}

function switchView(sectionName) {
    // console.log(`--> switchView(${sectionName})`);
    for (let i = 0; i < display.children.length; i++) {
        const item = display.children[i];

        if (item.id === sectionName) {
            item.classList.add('show');
        }
        else if (item.id != '') {
            item.classList.remove('show');
        }
    }    
}

function extractObjectNames(arr) {
    const newArr = arr.map( (o) => o.name );
    return newArr;
}


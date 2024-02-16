const MAX_SEARCH = 10;

const STORAGE_NAME = 'punk_api';
const STORE_VIEW = 'view';  // search
const STORE_PAGE = 'page';  // page nbr
const STORE_PRODUCT = 0;  // product id
const STORE_SEARCH = 'search';  // search


let actPage = 0;
let searchString = '';

const mainProduct = document.getElementById('main-product');
mainProduct.addEventListener('click', (event) => {
    // console.log('click on article');
    if (event.target.tagName === "A") {
        // console.log('click on seeMore');
        event.preventDefault();
        event.stopPropagation();

        // const target = event.target;
        const id = event.target.getAttribute('data-id');
        // console.log('id: ' + id);
        importProduct(id);
    }

});

const productData = document.getElementById('product-data');

const display = document.getElementById('display');

const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();
    // console.log('submint form');
    importSearch();
});

const searchResults = document.querySelector('.search-results');

/* ###### Icons/logotype ###### */

const logotype = document.getElementById('logotype');
logotype.addEventListener('click', () => {
    // console.log('logotype');
    importProduct();
});

const iconHome = document.getElementById('icon_home');
iconHome.addEventListener('click', () => {
    // console.log('iconHome');
    importProduct();
});

const iconSearch = document.getElementById('icon_search');
iconSearch.addEventListener('click', () => {
    // console.log('iconSearch');
    displaySearch();
});


const seeMoreButton = document.querySelector('#main-product a');
if (seeMoreButton) {
    // console.log('adding listener to seeMoreButton');
    seeMoreButton.addEventListener('click', (event) => {
        event.stopPropagation();
        //console.log('seMoreButton()');
    });
}

const randomButton = document.querySelector("#display > button");
randomButton.addEventListener('click', () => {
    // console.log('moreButton');
    importProduct();
});

const arrowPrevious = document.querySelector('.pager.left');
arrowPrevious.addEventListener('click', clickPreviousPage);

const arrowNext = document.querySelector('.pager.right');
arrowNext.addEventListener('click', clickNextPage);

const loader = document.querySelector('#display .loader');





/* ###### Init system ###### */
// view
const initData = init();
 console.log('initData:', initData);

// console.log('script start');
// importProduct();  // Default start with random beer

const view = (initData) ? initData[0] : 'product';
 console.log('view: ' + view);

switch (view) {
    case 'data':  // Product details
        const prodId = (initData[1]) ? initData[1] : 0;
         console.log('# Show data: ' + prodId);
        importProduct(prodId);
        break;
    case 'product':  // Product card
         console.log('# Show product');
        importProduct();
        break;
    case 'search':  // Search
         console.log('# Show search');
        displaySearch();
        break;
    default:
        // console.error('Bad view');
        importProduct();
        break;
}

// displaySearch();

// STORAGE_NAME: 
// ['search', [string]]
// ['data', 102]
// ['product'] || ['product', 102]

function init() {

    const arr = JSON.parse( localStorage.getItem(STORAGE_NAME) );

    return arr;
}


function init2() {  // Set default values  OLD
    const obj = {
        view: 'product',
        productId: 0,
        page: 0,
        search: ''
    };
    
    const view = localStorage.getItem(STORE_VIEW);
    if (view) {
        obj.view = view;
    }

    const prodId = localStorage.getItem(STORE_PRODUCT);
    if (prodId) {
        obj.productId = prodId;
    }

    const page = localStorage.getItem(STORE_PAGE);
    if (page) {
        obj.page = page;
    }

    const search = localStorage.getItem(STORE_SEARCH);
    if (search) {
        obj.search = search;
    }
    
    return obj;
}


async function importProduct(prodId = 0) {
     console.log(`--> importProduct(${prodId})`);
    loader.classList.add('active');
    // Ask for prodId or random
    let url = "https://api.punkapi.com/v2/beers/";
    url += (prodId >= 1) ? prodId : "random";
    // console.log('url: ' + url);

    try {
        const response = await fetch(url);
        const data = await response.json();
         console.log('Running prodId: ' + prodId);

        if (prodId > 0) {
            displayProduct(data[0], prodId);
            localStorage.setItem( STORAGE_NAME, JSON.stringify(['data', prodId]) );
        } else {
            displayProductCard(data[0]);
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

    // image is not always provided
    const imagePath = (product.image_url) ? product.image_url : '';
        
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
    // console.log('article:', articleInner);
     
    mainProduct.innerHTML = articleInner;

    scrollToTop();
    switchView('product');
}

function displayProduct(product, prodId = 0) {
    // console.log(`--> displayProduct(product, ${prodId})`);
    // console.log('product:', product);
    
    if (prodId >= 1) {  // Show selected product
        const imagePath = (product.image_url) ? product.image_url : '';

        const volume = product.volume.value + ' ' + product.volume.unit;
        // console.log('volume: ' + volume);

        const alcohol = product.abv + "%";

        const hops = extractObjectNames(product.ingredients.hops);
        // console.log('hops', hops.join(', '));

        const ingredients = Object.keys(product.ingredients);
        // console.log('ingredients: ', ingredients);
        
        const foodPairing = Object.values(product.food_pairing);
        // console.log('foodPairing', foodPairing);

        let article = `
            
                <img src="${imagePath}" alt="${product.name}">
                <div class="card-content">
                    <h4 title="${product.name}">${product.name}</h4> 

                    <div class="list">
                        <div>
                            ${product.description}
                        </div>
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
                </div>
            `;
        // productData
        productData.innerHTML = article;
        
        scrollToTop();

        switchView('data');
    }
}

/* ###### Search ###### */
function clickPreviousPage() {
    // console.log(`--> click clickPreviousPage() actPage: ${actPage}, searchString: '${searchString}'`);
    if (searchString && !arrowPrevious.classList.contains('inactive') ) {
        // console.log(`=> importSearch(${actPage - 1})`);
        importSearch(actPage - 1);
    }
    else {
        console.error('Clicked inactive .pager.left!?');
    }
}

function clickNextPage() {  
    // console.log(`--> click nextPage() actPage: ${actPage}, searchString: '${searchString}'`);
    if (searchString && !arrowNext.classList.contains('inactive') ) {
        // console.log(`=> importSearch(${actPage - 1})`);
        importSearch(actPage + 1);
    }
    else {
        console.error('Clicked inactive .pager.right!?');
    }
}

function updateSearchNav(page = 0, more = false) {  // actPage, more
    // console.log(`--> updateSearchNav(${page}, ${more})`);
    
    const searchNavigaton = document.querySelector('.search-navigation');
    
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



async function importSearch(newPageNbr = 0) {  // value only from arrows!
    // console.log(`--> importSearch(${pageNbr}) actPage: ` + pageNbr);
    // console.log(`searchString: '${searchString}'`);  // global
    updateSearchNav();  // Empty previous result

    const input = form.querySelector('input');

    // loader?
    loader.classList.add('active');
    
    let url;  // = `https://api.punkapi.com/v2/beers?page=${pageNbr}&per_page=${MAX_SEARCH}&beer_name=${searchString}`;
    let hasMore = false;
    
    if (newPageNbr > 0) {  // Previous/next page
        input.value = searchString;  // Set input to remove changes
    }
    else {  // New search
        searchString = input.value.trim();
        newPageNbr = 1;
    }
    
    url = `https://api.punkapi.com/v2/beers?page=${newPageNbr}&per_page=${MAX_SEARCH}&beer_name=${searchString}`;
    // console.log('url: ' + url);

    try {
        const response = await fetch(url);
        const data = await response.json();
        // console.log('data: ', data);

        // Check if there are more search results...
        if (newPageNbr > actPage && data.length >= MAX_SEARCH) {  
            // console.log('Check for more results...');
            hasMore = await searchMoreResults(searchString, newPageNbr);
            // console.log(`hasMore: ${hasMore}`);
        }
        displaySearchResults(data);  // Show result
    } catch (error) {
        console.error('Error: ', error);
    } finally {
        console.log(`hasMore 2: ${hasMore}`);
        updateSearchNav(newPageNbr, hasMore);  // Update page navigation
        loader.classList.remove('active');
    }

    if (newPageNbr > 0) {
        actPage = (newPageNbr > 0) ? newPageNbr : 1;
    }
    actPage = newPageNbr;
    // console.log('actPage: ' + actPage);

    // localStorage.setItem(STORE_PAGE, actPage);
    // localStorage.setItem(STORE_SEARCH, url);

}

async function searchMoreResults(searchString, pageNbr) {
    // console.log(`--> searchMoreResults(${searchString}, ${pageNbr})`);
    let hasMore = false;
    /*  // page = (pageNbr * MAX_SEARCH) + 1
        pageNbr 1: https://api.punkapi.com/v2/beers?page=11&per_page=1&beer_name=beer
        
        pageNbr 2: https://api.punkapi.com/v2/beers?page=21&per_page=1&beer_name=beer
    */

    const nbr = pageNbr * MAX_SEARCH + 1;  // Create fictive page number
    const url = `https://api.punkapi.com/v2/beers?page=${nbr}&per_page=1&beer_name=${searchString}`;
    // console.log(`url: ${url}`);

    try {
        const response = await fetch(url);
        const data = await response.json();
        // console.log('Next data: ', data);
        hasMore = (data.length > 0) ? true : false;
    } catch (error) {
        console.error('Error:', error);
    }

    return hasMore;
}


async function importSearch_2(pageNbr = 0) {  // value only from arrows!
    // console.log(`--> importSearch(${pageNbr}) actPage: ` + pageNbr);

    updateSearchNav();  // Empty previous result

    const input = form.querySelector('input');

    // loader?
    loader.classList.add('active');
    
    let url;  // = `https://api.punkapi.com/v2/beers?page=${pageNbr}&per_page=${MAX_SEARCH}&beer_name=${searchString}`;
    let hasMore = false;
    
    if (pageNbr > 0) {  // Previous/next page
        input.value = searchString;  // Set input to remove changes
    }
    else {  // New search
        searchString = input.value.trim();
        pageNbr = 1;
    }
    
    url = `https://api.punkapi.com/v2/beers?page=${pageNbr}&per_page=${MAX_SEARCH}&beer_name=${searchString}`;
    // console.log('url: ' + url);

    try {
        const response = await fetch(url);
        const data = await response.json();
        // console.log('data: ', data);
        
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const element = `<div class="link" data-id="${item.id}">${item.name}</div>`;
            searchResults.insertAdjacentHTML('beforeend', element);
        }

        // Check if there are more search results...
        try {
            let urlMore = `https://api.punkapi.com/v2/beers?page=${pageNbr + 1}&per_page=${MAX_SEARCH}&beer_name=${searchString}`;
            // console.log('urlMore: ' + urlMore);
            const response = await fetch(urlMore);
            const data = await response.json();
            // console.log('data 2: ', data);
            
            hasMore = (data.length > 0) ? true : false;
        } catch (error) {
            console.error('Error 2: ', error);
        }

        // Update page navigation
        updateSearchNav(pageNbr, hasMore);
    } catch (error) {
        console.error('Error: ', error);
    } finally {
        loader.classList.remove('active');
    }


    if (pageNbr > 0) {
        actPage = (pageNbr > 0) ? pageNbr : 1;
    }
    actPage = pageNbr;
    // console.log('actPage: ' + actPage);

    // localStorage.setItem(STORE_PAGE, actPage);
    // localStorage.setItem(STORE_SEARCH, url);

}

function displaySearch(arr = undefined) {
    // console.log('--> displaySearch()');
    // console.log('arr:', arr);

    switchView('search');

    scrollToTop();
}

function displaySearchResults(results) {
     console.log(`--> displaySearchResults(${results.length})`);
    for (let i = 0; i < results.length; i++) {
        const item = results[i];
        const element = `<div class="link" data-id="${item.id}">${item.name}</div>`;
        searchResults.insertAdjacentHTML('beforeend', element);
    }
}




function scrollToTop() {
    // console.log('--> scrollToTop()');
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
    });
}

function switchView(sectionName) {
    // console.log(`--> closeOthers(${id})`);
    for (let i = 0; i < display.children.length; i++) {
        const item = display.children[i];

        if (item.id === sectionName) {
            item.classList.add('show');
            // localStorage.setItem(STORE_VIEW, sectionName);
        }
        else if (item.id != '') {
            item.classList.remove('show');
        }
    }    
}

function extractObjectNames(arr) {
    // array wit objects
    // const arr = student.subjects.map( (s) => s.name);
    const newArr = arr.map( (o) => o.name );
    return newArr;
}


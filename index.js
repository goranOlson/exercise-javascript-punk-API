const maxPage = 10;


const mainProduct = document.getElementById('main-product');

const display = document.getElementById('display');



// const sectionSearch = document.getElementById('#search');



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


// const seMoreButton = document.querySelector('#main-product a');
// seMoreButton.addEventListener('click', (event) => {
//     event.stopPropagation();
//     console.log('seMoreButton');
// });

const randomButton = document.querySelector("#display > button");
randomButton.addEventListener('click', () => {
    // console.log('moreButton');
    importProduct();
});




// console.log('script start');
importProduct();

function moreClick() {
    window.location.assign("index.html");
}

async function importProduct(prodId = 0) {
    // console.log(`--> importProduct(${prodId})`);

    // Ask for prodId or random
    let url = "https://api.punkapi.com/v2/beers/";
    url += (prodId >= 1) ? prodId : "random";
    // console.log('url: ' + url);

    try {
        const response = await fetch(url);
        const data = await response.json();
        // console.log('Running prodId: ' + prodId);

        if (prodId > 0) {
            displayProduct(data[0], prodId);
        } else {
            displayProductCard(data[0])
        }
    } catch (error) {
        console.error('Error: ', error);
    }
}

function displayProductCard(product) {
    // console.log(`--> displayProduct(product) => ${product.name}`);
    // console.log('product:', product);

    // let article;
    const imagePath = (product.image_url) ? product.image_url : '';
        
    // Show random
    let articleInner = `
            <img src="${imagePath}" alt="${product.name}">
            <div class="card-content">
                <h4 title="${product.name}">${product.name}</h4> 
                <p>${product.tagline}</p> 
                <p>${product.abv}% alcohol</p> 
                <p>
                    
                    <a href="index.html?prod=${product.id}">Se More <i class="fas fa-play"></i></a>
                </p>
            </div>`;
    // console.log('article:', articleInner);
     
    mainProduct.innerHTML = articleInner;

    scrollToTop();
    closeOthers('product');
}

function scrollToTop() {
    // console.log('--> scrollToTop()');
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
    });
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
            <article id="main-product" class="product" style="height: max-content">
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
            </article>`;

        // Remove previous product and add new product
        display.removeChild(display.children[0]);
        display.insertAdjacentHTML('afterbegin', article);
        scrollToTop();
    }
}

function displaySearch() {
    // console.log('--> displaySearch()');


    closeOthers('search');
    scrollToTop();
}

function closeOthers(id) {
    // console.log(`--> closeOthers(${id})`);

    // console.log('display:', display);

    for (let i = 0; i < display.children.length; i++) {
        const item = display.children[i];
        // console.log(item.id);

        if (item.id === id) {
            item.classList.add('show');
            // console.log('show: ' + item.id);
        }
        else if (item.id != '') {
            item.classList.remove('show');
            // console.log('hide: ' + item.id);
        }
    }    
}

function extractObjectNames(arr) {
    // array wit objects
    // const arr = student.subjects.map( (s) => s.name);
    const newArr = arr.map( (o) => o.name );
    return newArr;
}


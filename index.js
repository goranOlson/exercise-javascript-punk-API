const maxPage = 10;


const mainProduct = document.getElementById('main-product');

const display = document.getElementById('display');



const targetList = getTarget();
 console.log('targetList:', targetList);

const target = (targetList) ? targetList[0] : '';  // Ex: ['prod', '280']
// console.log(`target: ${target}`);





const logotype = document.getElementById('logotype');
logotype.addEventListener('click', () => {
    console.log('logotype');
    importProduct();
});

const iconHome = document.getElementById('icon_home');
iconHome.addEventListener('click', () => {
    console.log('iconHome');
    importProduct();
});

const iconSearch = document.getElementById('icon_search');
iconSearch.addEventListener('click', () => {
    console.log('iconSearch');
    displaySearch();
});

const moreButton = document.querySelector(".display button");
moreButton.addEventListener('click', () => {
    console.log('moreButton');
    importProduct();
});



// page = '' || prod | search

// switch (target) {
//     case 'prod':  // prod=280
//         importProduct(targetList[1]);
//         break;
//     case 'search':  // search='Something'
//         displaySearch();
//         break;
//     default:
//         // console.log('No target...');
//         importProduct();
//         break;
// }

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
    // console.log(`--> displayProduct(product)`);
    // console.log('product:', product);

    // let article;
    const imagePath = (product.image_url) ? product.image_url : '';
        
    // Show random
    let article = `
        <article id="main-product" class="card">
            <img src="${imagePath}" alt="${product.name}">
            <div class="card-content">
                <h4 title="${product.name}">${product.name}</h4> 
                <p>${product.tagline}</p> 
                <p>${product.abv}% alcohol</p> 
                <p>
                    
                    <a href="index.html?prod=${product.id}">Se More <i class="fas fa-play"></i></a>
                </p>
            </div>
        </article>`;
    
    // Remove previous product and add new product
    display.removeChild(display.children[0]);
    display.insertAdjacentHTML('afterbegin', article);
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
    }
}

function displaySearch() {
    console.log('displaySearch()');
    // console.log('targetList: ', targetList);

    if (targetList) { // S
        
    }
    else {

    }
}

function extractObjectNames(arr) {
    // array wit objects
    // const arr = student.subjects.map( (s) => s.name);
    const newArr = arr.map( (o) => o.name );
    return newArr;
}

function getTarget() {  // : array | undefined
    // console.log('--> getTarget()');

    // product:     ?prod=99
    // query:       ?name=test%20
    // paginering:  ?page=2

    let arr;

    let url = window.location.href;
     console.log(`url: ${url}`);

    const pos = url.indexOf('?');

    if (pos >= 0) {
        let args = url.substring(pos + 1);  // => prod=99
        arr = args.split('=');  // 
        // console.log(`arr: ${arr}`);
    }

    return arr;
}
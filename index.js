const maxPage = 10;


const mainProduct = document.getElementById('main-product');

const display = document.getElementById('display');

const moreButton = document.querySelector(".display button");
moreButton.addEventListener('click', displayRandom);

const targetList = getTarget();
 console.log('targetList:', targetList);
if (targetList) {
console.log('got targetList');
}

// 0: prod | name | page
// 1: value
const target = (targetList) ? targetList[0] : '';
 console.log(`target: ${target}`);
switch (target) {
    case 'prod':
        displayProduct(targetList[1]);
        break;

    default:
        // console.log('No target...');
        displayRandom();
        break;
}

async function displayRandom() {
    // Random
    console.log('--> displayDefault()');

    const randomURL = "https://api.punkapi.com/v2/beers/random";

    try {
        const response = await fetch(randomURL);
        const data = await response.json();
        // console.log('data:', data);
        const product = data[0];
         console.log('product:', product);

        const imagePath = (product.image_url) ? product.image_url : '';
         
        const article = `
            
                <img src="${imagePath}" alt="${product.name}">
                <div class="card-content">
                    <h4 title="${product.name}">${product.name}</h4> 
                    <p>${product.tagline}</p> 
                    <p>${product.abv}% alcohol</p> 
                    <p>
                        <a href="index.html?prod=${product.id}">Se More <i class="fas fa-play"></i></a>
                    </p>
                </div>
            
            `;

        display.children[0].innerHTML = article;
        
    } catch (error) {
        console.error('Error: ', error);
    }

}


function displayProduct(prodId) {  // [ 99 ]
    console.log(`--> displayProduct(${prodId})`);
}


function getTarget() {  // : array | undefined
    // console.log('--> getTarget()');

    // product:     ?prod=99
    // query:       ?name=test%20
    // paginering:  ?page=2

    let arr;

    let url = window.location.href;
    // console.log(`url: ${url}`);

    const pos = url.indexOf('?');

    if (pos >= 0) {
        let args = url.substring(pos + 1);  // => prod=99
        arr = args.split('=');
        // console.log(`arr: ${arr}`);
    }

    return arr;
}
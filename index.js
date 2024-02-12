const maxPage = 10;


const mainProduct = document.getElementById('main-product');

const display = document.getElementById('display');

const moreButton = document.querySelector(".display button");
moreButton.addEventListener('click', importProduct);

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
        importProduct(targetList[1]);
        break;

    default:
        // console.log('No target...');
        importProduct();
        break;
}

async function importProduct(prodId = 0) {
    // Random
    console.log(`--> importProduct(${prodId})`);

    let url;

    if (prodId >= 1) {
        url = "https://api.punkapi.com/v2/beers/" + prodId;
    }
    else {
        url = "https://api.punkapi.com/v2/beers/random";
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        displayProduct(data[0], prodId);

    } catch (error) {
        console.error('Error: ', error);
    }
}



function displayProduct(product, prodId = 0) {
    console.log(`--> displayProduct(product, ${prodId})`);
    console.log('product:', product);

    let article;
    const imagePath = (product.image_url) ? product.image_url : '';
    
    if (prodId >= 1) {  // Show selected product
        const volume = product.volume.value + ' ' + product.volume.unit;
         console.log('volume: ' + volume);

        const alcohol = product.abv + "%";



        article = `
            <article id="main-product" class="card" style="height: max-content">
                <img src="${imagePath}" alt="${product.name}">
                <div class="card-content">
                    <h4 title="${product.name}">${product.name}</h4> 
                    <div>
                        <h5>Description</h5>
                        <p>${product.description}</p>
                    </div>

                    <div class="spread">
                        <span>${product.abv}% alcohol</span>
                        <span>${volume}</span>
                    </div>


                </div>
            </article>
        `;
    }
    else {  // Show random
        article = `
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
            </article>
        `;
    }



    // Remove previous product and add new product
    display.removeChild(display.children[0]);
    display.insertAdjacentHTML('afterbegin', article);
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
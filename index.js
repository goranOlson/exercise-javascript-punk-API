const maxPage = 10;


const mainProduct = document.getElementById('main-product');





const targetList = getTarget();
 console.log('targetList:', targetList);
 if (targetList) {
    console.log('got targetList');
 }

// 0: prod | name | page
// 1: value




// product:     ?prod=99
// query:       ?name=test%20
// paginering:  ?page=2

function getTarget() {  // : array | undefined
    console.log('--> getTarget()');

    let arr;

    let url = window.location.href;
    console.log(`url: ${url}`);

    const pos = url.indexOf('?');

    if (pos >= 0) {
        let args = url.substring(pos + 1);  // => prod=99
        arr = args.split('=');
        console.log(`args: ${args}`);
    }

    return arr;
}
export const BASE_URL = "https://api.punkapi.com/v2/beers";
export const MAX_SEARCH = 10;  // max results per page
export const STORAGE_NAME = 'punk_api';  // localStorage name
export const STORE_SEARCH = 'search';  // search

export const mainProduct = document.getElementById('main-product');
export const productData = document.getElementById('product-data');
export const display = document.getElementById('display');
export const searchResults = document.querySelector('.search-results');
export const form = document.querySelector('form');

/* ###### Icons/logotype ###### */
export const logotype = document.getElementById('logotype');
export const iconHome = document.getElementById('icon_home');
export const iconSearch = document.getElementById('icon_search');
export const seeMoreButton = document.querySelector('#main-product a');
export const randomButton = document.querySelector("#display > button");
export const arrowPrevious = document.querySelector('.pager.left');
export const arrowNext = document.querySelector('.pager.right');
export const loader = document.querySelector('#display .loader');

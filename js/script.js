'use strict';

let products = [];
let countProducts = 17;
let countProductsOnPage = 6;
let pagesCount;
let productsFiltered = [];
let components = new Set();
let productsHtml = document.getElementsByClassName('products')[0];
let paginationHtml = document.getElementsByClassName('pagination')[0];
let filterHtml = document.getElementsByClassName('filter')[0];
filterHtml.addEventListener('change', function (e) {filter(e.target.value)});
let componentsBaseList = ['Component4', 'Component5', 'Component6', 'Component7' ];

class Product {
    constructor (prop) {
        this.title = prop.title;
        this.image = prop.image;
        this.components = prop.components;
        this.calories = prop.calories;
        this.price = prop.price;
    }

    writeOnPage() {
        let productItem = document.createElement('div');
        productItem.className = 'product-item';

        let productImage = document.createElement('div');
        productImage.className = 'product-image';
        productImage.innerHTML = '<img src="' + this.image + '" alt="' + this.title + '">';
        productItem.appendChild(productImage);

        let productContent = document.createElement('div');
        productContent.className = 'product-content';
        productItem.appendChild(productContent);

        let productTitle = document.createElement('div');
        let productComponents = document.createElement('div');
        let productCalories = document.createElement('div');
        let productPrice = document.createElement('div');

        productTitle.className = 'product-title';
        productComponents.className = 'product-components';
        productCalories.className = 'product-calories';
        productPrice.className = 'product-price';

        productTitle.innerHTML = 'Title: ' + this.title;
        productComponents.innerHTML = 'Components: ' + this.components.join(', ');
        productCalories.innerHTML = 'Calories: ' + this.calories;
        productPrice.innerHTML = 'Price: ' + this.price;

        productContent.appendChild(productTitle);
        productContent.appendChild(productComponents);
        productContent.appendChild(productCalories);
        productContent.appendChild(productPrice);

        productsHtml.appendChild(productItem);
    }
}

for(let i = 0; i < countProducts; i++) {
    products.push(new Product({
        title: 'Pizza ' + (i+1),
        image: '/images/product.png',
        components: ['Component1', 'Component2', 'Component3', randomComponent()],
        calories: randomCalories(),
        price: randomPrice()
    }));
}

addPagination();

writeProductsOnPage(0);

getComponentsList();

function randomPrice() {
    return Math.floor(Math.random() * (200 - 100 + 1)) + 100;
}

function randomCalories() {
    return Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
}

function randomComponent() {
    let componentId = Math.floor(Math.random() * 4);
    return componentsBaseList[componentId];
}

function writeProductsOnPage(currentPage, productsLocal = products) {
    productsHtml.innerHTML = '';
    let countProductsLocal = productsLocal.length;
    let startProduct = currentPage * countProductsOnPage;

    let lastProduct;
    if(countProductsLocal < startProduct +  countProductsOnPage) {
        lastProduct = countProductsLocal;
    }
    else {
        lastProduct = startProduct +  countProductsOnPage;
    }
    for(let i = startProduct; i < lastProduct; i++) {
        productsLocal[i].writeOnPage();
    }
    addPagination(productsLocal, countProductsLocal);
}

function toggleList() {
    if(productsHtml.classList.contains('list')) {
        productsHtml.classList.remove('list');
    }
    else {
        productsHtml.classList.add('list');
    }
}

function addPagination(productsLocal = products, countProductsLocal = countProducts) {
    paginationHtml.innerHTML = '';
    pagesCount = Math.ceil(countProductsLocal / countProductsOnPage);
    if(pagesCount <= 1) {
        return 0;
    }
    for(let i = 1; i <= pagesCount; i++) {
        let paginationItem = document.createElement('div');
        paginationItem.className = 'page';
        paginationItem.id = 'page' + i;
        paginationItem.innerHTML = i;
        paginationItem.onclick = function () {
            writeProductsOnPage(i-1, productsLocal);
        };
        paginationHtml.appendChild(paginationItem);
    }
}

function sortProducts(param) {
    products.sort(function (a, b) {
        if (a[param] > b[param]) {
            return 1;
        }
        return -1;
    });
    writeProductsOnPage(0);
}

function createListOfComponents() {
    let componentsList = new Set();
    for(let i = 0; i < countProducts; i++) {
        let product = products[i];
        let componentsCount = products[i].components.length;
        for(let j = 0; j < componentsCount; j++) {
            componentsList.add(product.components[j])
        }
    }
    return componentsList;
}

function getComponentsList() {
    components = createListOfComponents();
    for(let component of components) {
        let option = document.createElement('option');
        option.value = component;
        option.innerHTML = component;
        option.onclick = function () {
            filter(component);
        };
        filterHtml.appendChild(option);
    }
}

function filter(component) {
    productsFiltered = [];
    for(let i = 0; i < countProducts; i++) {
        let product = products[i];
        let componentsCount = products[i].components.length;
        for(let j = 0; j < componentsCount; j++) {
            if(product.components[j].match(component)) {
                console.log('bb');
                productsFiltered.push(product);
                break;
            }
        }
    }
    console.log(productsFiltered);
    writeProductsOnPage(0, productsFiltered);
}


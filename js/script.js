'use strict';

let listType = 'grid';
let products = [];
let productsFiltered = [];
let countProducts = 17;
let countProductsOnPage = 6;
let selectedProductsList;
let selectedProductsCount;
let pagesCount;
let components = new Set();
let productsHtml = document.getElementsByClassName('products')[0];
let paginationHtml = document.getElementsByClassName('pagination')[0];
let filterHtml = document.getElementsByClassName('filter')[0];
let componentsBaseList = ['Component1', 'Component2', 'Component3', 'Component4'];

filterHtml.addEventListener('change', function (e) {filter(e.target.value)});

class Product {
    constructor (prop) {
        this.title = prop.title;
        this.image = prop.image;
        this.components = prop.components;
        this.calories = prop.calories;
        this.price = prop.price;
    }

    formProduct() {
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

function generateProducts() {
    for(let i = 0; i < countProducts; i++) {
        products.push(new Product({
            title: 'Pizza ' + (i+1),
            image: 'images/product.png',
            components: [randomComponent(), 'Component5', 'Component6', 'Component7'],
            calories: randomCalories(),
            price: randomPrice()
        }));
    }
    setProductList(products);
}

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

function setProductList(productList) {
    selectedProductsList = productList;
    selectedProductsCount = selectedProductsList.length;
}

function clearHtmlBlock(htmlBlock = productsHtml) {
    htmlBlock.innerHTML = '';
}

function defineFirstProductId(currentPage) {
    return currentPage * countProductsOnPage;
}

function defineLastProductId(firstProduct) {
    if(selectedProductsCount < firstProduct + countProductsOnPage || listType === 'list') {
        return selectedProductsCount;
    }
    return firstProduct + countProductsOnPage;
}

function writeProductsOnPage(currentPage = 0) {
    let startProductId = defineFirstProductId(currentPage);
    let lastProductId = defineLastProductId(startProductId);

    clearHtmlBlock();
    addPagination();

    for(let i = startProductId; i < lastProductId; i++) {
        selectedProductsList[i].formProduct();
    }
}

function toggleList() {
    if(productsHtml.classList.contains('list')) {
        productsHtml.classList.remove('list');
        filterHtml.classList.remove('hidden');
        listType = 'grid';
        writeProductsOnPage();
    }
    else {
        productsHtml.classList.add('list');
        filterHtml.classList.add('hidden');
        listType = 'list';
        setProductList(products);
        writeProductsOnPage();
    }
}

function addPagination() {
    clearHtmlBlock(paginationHtml);
    pagesCount = Math.ceil(selectedProductsCount / countProductsOnPage);
    if(pagesCount <= 1 || listType === 'list') {
        return 0;
    }
    for(let i = 1; i <= pagesCount; i++) {
        let paginationItem = document.createElement('div');
        paginationItem.className = 'page';
        paginationItem.id = 'page' + i;
        paginationItem.innerHTML = i;
        paginationItem.onclick = function () {
            writeProductsOnPage(i-1);
        };
        paginationHtml.appendChild(paginationItem);
    }
}

function sortProducts(param) {
    selectedProductsList.sort(function (a, b) {
        if (a[param] > b[param]) {
            return 1;
        }
        return -1;
    });
    writeProductsOnPage();
}

function createListOfComponents() {
    let componentsList = new Set();
    componentsList.add('No filter');
    for(let i = 0; i < countProducts; i++) {
        let product = selectedProductsList[i];
        let componentsCount = selectedProductsList[i].components.length;
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
    if(component === 'No filter') {
        setProductList(products);
        writeProductsOnPage();
        return 0;
    }
    productsFiltered = [];
    for(let i = 0; i < countProducts; i++) {
        let product = products[i];
        let componentsCount = products[i].components.length;
        for(let j = 0; j < componentsCount; j++) {
            if(product.components[j].match(component)) {
                productsFiltered.push(product);
                break;
            }
        }
    }
    setProductList(productsFiltered);
    writeProductsOnPage();
}

generateProducts();
writeProductsOnPage();
addPagination();
getComponentsList();
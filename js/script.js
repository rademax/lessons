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
let componentsBaseList = [
    {name: 'Component 1', price: 12, calories: 75, included: true},
    {name: 'Component 2', price: 22, calories: 45, included: true},
    {name: 'Component 3', price: 15, calories: 50, included: false},
    {name: 'Component 4', price: 20, calories: 60, included: true},
    {name: 'Component 5', price: 30, calories: 95, included: false},
    {name: 'Component 6', price: 11, calories: 52, included: true},
    {name: 'Component 7', price: 10, calories: 72, included: false},
    {name: 'Component 8', price: 24, calories: 63, included: true},
    {name: 'Component 9', price: 35, calories: 55, included: false},
    {name: 'Component 10', price: 35, calories: 55, included: true},
];

filterHtml.addEventListener('change', function (e) {filter(e.target.value)});

productsHtml.onclick = function (event) {
    let target = event.target;

    if(target.tagName !== 'LI') {
        return 0;
    }

    toggleComponent(target);
};

function toggleComponent(target) {
    if(target.classList.contains('excluded-component')) {
        target.classList.remove('excluded-component');
        changePriceAndCalories(target, true);
    }
    else {
        target.classList.add('excluded-component');
        changePriceAndCalories(target, false);
    }
}

function changePriceAndCalories(target, increasePrice = true) {
    let component = target.innerHTML;

    while(target.className !== 'product-content') {
        target = target.parentNode;
    }

    let title = target.getElementsByClassName('product-title')[0].innerHTML;
    let product = {};

    for(let i = 0; i < countProducts; i++) {
        product = products[i];
        if(product.title === title) {
            break;
        }
    }

    // let components = getComponentsList();
    //
    // for(let component of components) {
    //     component = product.components[i];
    //     if(component.name.match(component)) {
    //
    //     }
    // }
}

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

        productTitle.innerHTML = this.title;
        productComponents.innerHTML = 'Selected components: ';
        productComponents.appendChild(this.generateProductComponentsList());
        productCalories.innerHTML = 'Calories: ' + this.formSum('calories');
        productPrice.innerHTML = 'Price: ' + this.formSum('price');

        productContent.appendChild(productTitle);
        productContent.appendChild(productComponents);
        productContent.appendChild(productCalories);
        productContent.appendChild(productPrice);

        productsHtml.appendChild(productItem);
    }

    generateProductComponentsList() {
        let productComponentsList = document.createElement('ul');
        for(let i = 0; i < this.components.length; i++) {
            let component = this.components[i];
            let productComponentsListItem = document.createElement('li');
            productComponentsListItem.innerHTML = component.name;
            if(component.included !== true) {
                productComponentsListItem.className = 'excluded-component';
            }
            productComponentsList.appendChild(productComponentsListItem);
        }
        return productComponentsList;
    }

    formSum(element = 'price') {
        let sum = this[element];
        for(let i = 0; i < this.components.length; i++) {
            let component = this.components[i];
            if(component['included'] === true) {
                sum += component[element];
            }
        }
        return sum;
    }
}

function generateProducts() {
    for(let i = 0; i < countProducts; i++) {
        products.push(new Product({
            title: 'Pizza ' + (i+1),
            image: 'images/product.png',
            components: addComponentsToProduct(),
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

function addComponentsToProduct() {
    let componentsSet = new Set();
    let componentsList = [];
    let componentsCount = Math.floor(Math.random() * (7 - 3 + 1)) + 3;
    for(let i = 0; i < componentsCount; i++) {
        componentsSet.add(randomComponent());
    }
    for(let component of componentsSet) {
        componentsList.push(component);
    }
    return componentsList;
}

function randomComponent() {
    let componentId = Math.floor(Math.random() * 10);
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
        let product = products[i];
        let componentsCount = product.components.length;
        for(let j = 0; j < componentsCount; j++) {
            componentsList.add(product.components[j].name);
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
        let componentsCount = product.components.length;
        for(let j = 0; j < componentsCount; j++) {
            if(product.components[j].name.match(component)) {
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
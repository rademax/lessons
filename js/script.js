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
let cart = [];
let totalAmountHtml = document.getElementsByClassName('total-price')[0];
let clearCartButton = document.getElementsByClassName('clear-cart')[0];

if(filterHtml) {
    filterHtml.addEventListener('change', function (e) {filter(e.target.value)});
}

if(clearCartButton) {
    clearCartButton.addEventListener('click', function (e) {clearCart()});
}


if(productsHtml) {
    productsHtml.onclick = function (event) {
        let target = event.target;

        if(target.tagName !== 'LI' && target.className !== 'product-buy') {
            return 0;
        }

        if(target.tagName === 'LI') {
            toggleComponent(target);
        }
        else if(target.className === 'product-buy') {
            addToCart(target);
        }
    };
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

        this.formProductInner(productItem);

        productsHtml.appendChild(productItem);
    }

    formProductInner(productItem = '') {
        productItem.innerHTML = '';
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
        let productBuy = document.createElement('div');
        
        productTitle.className = 'product-title';
        productComponents.className = 'product-components';
        productCalories.className = 'product-calories';
        productPrice.className = 'product-price';
        productBuy.className = 'product-buy';

        productTitle.innerHTML = this.title;
        productComponents.innerHTML = 'Selected components: ';
        productComponents.appendChild(this.generateProductComponentsList());
        productCalories.innerHTML = this.calories + ' calories';
        productPrice.innerHTML = this.price + ' uah';
        productBuy.innerHTML = 'Add to cart';

        productContent.appendChild(productTitle);
        productContent.appendChild(productComponents);
        productContent.appendChild(productCalories);
        productContent.appendChild(productPrice);

        productContent.appendChild(productBuy);
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
}

function generateProducts() {
    for(let i = 0; i < countProducts; i++) {
        let components = addComponentsToProduct();
        let calories = randomCalories(components);
        let price = randomPrice();
        products.push(new Product({
            title: 'Pizza ' + (i+1),
            image: 'images/product.png',
            components: components,
            calories: calories,
            price: price
        }));
    }
    setProductList(products);
}

function randomPrice(components) {
    let price = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
    for(component in components) {
        if(component.included)
        price += component.price;
    }
    return price;
}

function randomCalories() {
    let calories = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
    for(component in components) {
        if(component.included)
        calories += component.calories;
    }
    return calories;
}

function addComponentsToProduct() {
    let componentsSet = new Set();
    let componentsList = [];
    let componentsCount = 5;
    while(componentsSet.size < componentsCount) {
        componentsSet.add(randomComponent());
    }
    for(let component of componentsSet) {
        let componentForInclude = {};
        for (var key in component) {
            componentForInclude[key] = component[key];
        }
        componentsList.push(componentForInclude);
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
    return components;
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

// Function for add/delete component in product
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

// Function for define selected product
function defineProduct(target) {
    let title;
    let product = {};

    target = findProductContent(target);

    title = target.getElementsByClassName('product-title')[0].innerHTML;
    
    for(let i = 0; i < countProducts; i++) {
        product = products[i];
        if(product.title === title) {
            break;
        }
    }

    return product;
}

function findProductContent(target) {
    while(target.className !== 'product-content') {
        target = target.parentNode;
    }
    return target;
}

function changePriceAndCalories(target, increasePrice = true) {
    let componentName = target.innerHTML;
    target = findProductContent(target);
    let product = defineProduct(target);

    let productItem = target.parentNode;
    let productComponents = product.components;
    let productComponentsCount = productComponents.length;

    for(let i = 0; i < productComponentsCount; i++) {
        let component = productComponents[i];
        if(component.name.match(componentName)) {
            component.included = increasePrice;
            if(increasePrice) {
                product.price += component.price;
                product.calories += component.calories;
            }
            else {
                product.price -= component.price;
                product.calories -= component.calories;
            }
            product.formProductInner(productItem);
            break;
        }
    }
}

// Function created for clone products for cart because one product can contain different components
function cloneObject(object) {
    let newObject = {};
    for (var key in object) {
        if(object[key] instanceof Object) {
            newObject[key] = cloneObject(object[key]);
        }
        else {
            newObject[key] = object[key];
        }
    }
    return newObject;
}

function addToCart(target) {
    let product = defineProduct(target);

    let productForCart = (product);

    cart.push(productForCart);

    localStorage.setItem('cart', JSON.stringify(cart));
}

class Cart extends Product {
    formProductInner(productItem = '') {
        productItem.innerHTML = '';
        let productImage = document.createElement('div');
        productImage.className = 'product-image';
        productImage.innerHTML = '<img src="' + this.image + '" alt="' + this.title + '">';
        productItem.appendChild(productImage);

        let productContent = document.createElement('div');
        productContent.className = 'product-content';
        productItem.appendChild(productContent);

        let productTitle = document.createElement('div');
        let productPrice = document.createElement('div');
        
        productTitle.className = 'product-title';
        productPrice.className = 'product-price';

        productTitle.innerHTML = this.title;
        productPrice.innerHTML = this.price + ' uah';

        productContent.appendChild(productTitle);
        productContent.appendChild(productPrice);
    }
}

function getCart() {
    let products = [];
    let cart = JSON.parse(localStorage.getItem('cart'));

    for(let i = 0; i < cart.length; i++) {
        let product = cart[i];
        let title = product.title;
        let image = product.image;
        let components = product.components;
        let calories = product.calories;
        let price = product.price;
        products.push(new Cart({
            title: title,
            image: image,
            components: components,
            calories: calories,
            price: price
        }));
    }
    return products;
}

function totalAmount(products) {
    let amount = 0;
    for(let i = 0; i < products.length; i++) {
        amount += products[i].price;
    }
    return amount;
}

function addTotalAmount(amount) {
    totalAmountHtml.innerHTML = amount + ' uah';
}

function clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
    clearHtmlBlock(productsHtml);
    addMessageCardIsEmpty();
    addTotalAmount(0);
}

function addMessageCardIsEmpty() {
    let emptyCard = document.createElement('div');
    emptyCard.className = 'alert-message';
    emptyCard.innerHTML = 'Card is empty. Go <a href="index.html">back</a> and select products';
    productsHtml.appendChild(emptyCard);
}

if(document.getElementsByClassName('service-index')[0]) {
    generateProducts();
    writeProductsOnPage();
    addPagination();
    getComponentsList();
}
else {
    let productsCart = getCart();
    if(productsCart.length) {
        setProductList(productsCart);
        let total = totalAmount(productsCart);
        writeProductsOnPage();
        addTotalAmount(total);
    }
    else {
        addMessageCardIsEmpty();
    }
}
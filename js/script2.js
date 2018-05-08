'use strict';

let products = [];
let countProducts = 17;
let productsHtml = document.getElementsByClassName('products')[0];
let fragment = document.createDocumentFragment();

class Product {
    constructor (prop) {
        this.title = prop.title;
        this.image = prop.image;
        this.components = prop.components;
        this.calories = prop.calories;
        this.price = prop.price;
    }

    writeOnPage() {
        let templateCard = `
            <div class="product-item">
                <div class="product-image"><img src="/images/product.png" alt="Pizza 1"></div>
                <div class="product-content">
                    <div class="product-title">Title: ${this.title}</div>
                    <div class="product-components">Components: Component1, Component2, Component3, Component4</div>
                    <div class="product-calories">Calories: 250</div>
                    <div class="product-price">Price: 120</div>
                </div>
            </div>
            `;

        fragment.insertAdjacentHTML('beforeEnd', templateCard);
    }
}

for(let i = 0; i < countProducts; i++) {
    products.push(new Product({
        title: 'Pizza ' + (i+1),
        image: '/images/product.png',
        components: 'Component1, Component2, Component3, Component4',
        calories: 250,
        price: 120
    }));
}

for(let i = 0; i < products.length; i++) {
    products[i].writeOnPage();
}

productsHtml.appendChild(fragment);

function toggleList() {
    if(productsHtml.classList.contains('list')) {
        productsHtml.classList.remove('list');
    }
    else {
        productsHtml.classList.add('list');
    }
}
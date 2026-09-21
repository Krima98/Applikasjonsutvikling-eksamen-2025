export class ProductsAdmin extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render(data) {
        this.shadow.innerHTML = style;
        this.makeHeader();
        this.navigationListners();
        this.displayProductsEdit(data);
        this.filterProductsListener(data);
    }

    //-----------------------------------------------------------------------
    filterProductsListener(data) {
        const filterSelect = this.shadow.getElementById("filter");
        const myProductsBtn = this.shadow.getElementById("myProductsBtn");
        const categoryOption = this.shadow.getElementById("preText");

        filterSelect.addEventListener('change', evt => {
            categoryOption.remove();
            const productDiv = this.shadow.querySelector(".products");
            productDiv.remove();
            this.filterCategoryDisplay(data, filterSelect.value);
        });

        myProductsBtn.addEventListener('click', evt => {
            const productDiv = this.shadow.querySelector(".products");
            productDiv.remove();
            this.displayProductsEdit(data);
        });
    }

    //-----------------------------------------------------------------------
    filterCategoryDisplay(data, category) {
        const filterProducts = data.filter(item => item.prodCat == category);

        const productDiv = document.createElement("div");
        productDiv.classList.add("products");
        this.shadow.appendChild(productDiv);

        for (let item of filterProducts) {
            const productCard = this.productCard(item);
            const myHr = document.createElement("hr");
            productDiv.append(productCard, myHr);

            productCard.addEventListener('click', evt => {
                const goToDetailEvt = new CustomEvent("goToDetail", { composed: true, bubbles: true, detail: item.prodId });
                this.shadow.dispatchEvent(goToDetailEvt);
            });
        }
    }

    //-----------------------------------------------------------------------
    displayProductsEdit(data) {
        const filterProducts = data.filter(item => item.prodStatic === false);

        const productDiv = document.createElement("div");
        productDiv.classList.add("products");
        this.shadow.appendChild(productDiv);

        if (filterProducts.length == 0) {
            this.noItems();
        }

        for (let item of filterProducts) {
            const productCard = this.productCard(item);
            const myHr = document.createElement("hr");
            productDiv.append(productCard, myHr);

            productCard.addEventListener('click', evt => {
                const goToDetailEvt = new CustomEvent("goToDetail", { composed: true, bubbles: true, detail: item.prodId });
                this.shadow.dispatchEvent(goToDetailEvt);
            });
        }
    }

    //-----------------------------------------------------------------------
    productCard(item) {
        const productCard = document.createElement("div");
        productCard.classList.add("product");
        productCard.innerHTML = `
            <img src="${item.checkImg()}" alt="product-small-img">
            <div id="prodText">
                <h2>${item.prodName}</h2>
            </div>            
        `;

        return productCard;
    }

    //-----------------------------------------------------------------------
    noItems() {
        const productDiv = this.shadow.querySelector(".products");

        const noItemsDiv = document.createElement("div");
        noItemsDiv.classList.add("no-products");
        noItemsDiv.innerHTML = `
            <h2>No added products</h2>
            <p>There is currently no products for you to edit, add some above "Add product".</p>
            <p>You can look up other products that are pre listed on the server, but not change them.</p>
        `;
        productDiv.appendChild(noItemsDiv);
    }

    //-----------------------------------------------------------------------
    navigationListners() {
        const addBtn = this.shadow.getElementById("addBtn");
        const homeBtn = this.shadow.getElementById("goHome");

        addBtn.addEventListener('click', evt => {
            const goToAddProduct = new CustomEvent("goToAddProduct", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goToAddProduct);
        });

        homeBtn.addEventListener('click', evt => {
            const goHomeEvt = new CustomEvent("goHome", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goHomeEvt);
        });
    }

    //-----------------------------------------------------------------------
    makeHeader() {
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("header");
        headerDiv.innerHTML = `
            <h1>PRODUCTS</h1>
            <div class="headerButtons">
                <div class="navButtons">
                    <button id="goHome">HOME</button>
                    <button id="addBtn">Add product</button>               
                </div>

                <div class="filterButtons">
                    <button id="myProductsBtn">My product</button>

                    <select id="filter">
                        <option id="preText" value="">CATEGORY</option>
                        <option value="Special">Special</option>
                        <option value="Caramel">Caramel</option>
                        <option value="Jelly">Jelly</option>
                        <option value="Marshmallow">Marshmallow</option>
                        <option value="Chocolate">Chocolate</option>
                        <option value="Packaging">Packaging</option>
                        <option value="Equipment">Equipment</option>
                    </select>
                </div>
            </div>
        `;
        this.shadow.appendChild(headerDiv);
    }
}

//-----------------------------------------------------------------------
customElements.define("products-admin", ProductsAdmin);
//-----------------------------------------------------------------------

const style = `
    <style>
        .header {
            color: rgb(233, 233, 233);
            background-color: rgba(15, 15, 15, 1);
            padding: 10px;
        }

        .headerButtons {
            display: flex;
            justify-content: space-between;
            gap: 10px;
        }

        #addBtn, #goHome, #myProductsBtn {
            border: none;
            border-radius: 5px;
            height: 40px;
            width: 100px;
            padding: 10px; 
            color: black;
            background: rgba(46, 228, 107, 1);
            transition: 0.3s;
        }

        #addBtn:hover, #goHome:hover, #myProductsBtn:hover {
            cursor: pointer;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 1) inset;            
        }

        select {
            height: 40px;
            padding: 10px;
            border: none;
            border-radius: 4px;
            box-sizing: border-box;
            background: rgba(46, 228, 107, 1);
            transition: 0.3s;
        }

        select:focus {
            outline: none;
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }

        select:hover {
            box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 1) inset;
        }

        .no-products {
            margin: 10px;
        }
    
        .no-products h2, p {
            margin: 0px;
        }

        .product {
            display: flex;
            align-items: center; 
            transition: 0.5s;
        }
      
        .product:hover {
            cursor: pointer;
            background-color: rgba(46, 228, 107, 1);
        }

        #prodText h2 {
            margin: 0;
            margin-left: 10px;
        }

        hr {
            margin: 0;
            border: none;
            height: 1px;
            background: rgba(0, 0, 0, 1);
        }

        #stock {
            background-color: rgba(126, 126, 126, 1);
            color: white;
            padding: 5px;
            margin: 0;
        }
    </style>
`;

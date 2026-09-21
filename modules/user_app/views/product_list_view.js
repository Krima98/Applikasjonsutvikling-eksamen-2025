import { CONFIG } from "../../config";

export class ProductListView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render(data) {
        this.shadow.innerHTML = style;
        this.headerComponent();
        this.navigationListners();
        this.displayAllProductCard(data)
    }

    //-----------------------------------------------------------------------
    displayAllProductCard(data) {
        const allProductDiv = document.createElement("div");
        allProductDiv.classList.add("products");
        this.shadow.appendChild(allProductDiv);

        for (let item of data) {
            const productCard = this.productCard(item);
            const myHr = document.createElement("hr");
            allProductDiv.append(productCard, myHr);

            productCard.addEventListener('click', evt => {
                const getProductIdEvt = new CustomEvent("productSelected", { composed: true, bubbles: true, detail: item.prodId });
                this.shadow.dispatchEvent(getProductIdEvt);
            });
        }
    }

    //-----------------------------------------------------------------------
    productCard(item) {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.innerHTML = `
            <img src="${item.checkImg()}" alt="product-small-img">
            <div class="quick-info">
                <h3>${item.prodName}</h3>
                <h3>Price: ${item.checkDiscountListView()},- kr</h3>
            </div>
            `;
        return productDiv;
    }

    //-----------------------------------------------------------------------
    navigationListners() {

        const cartBtn = this.shadow.getElementById("cartBtn");
        const homeBtn = this.shadow.getElementById("goHome");

        homeBtn.addEventListener('click', evt => {
            const goHomeEvt = new CustomEvent("goHome", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goHomeEvt);
        });

        cartBtn.addEventListener('click', evt => {
            const cartViewEvt = new CustomEvent("goToCart", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(cartViewEvt);
        });

    }

    //-----------------------------------------------------------------------
    headerComponent() {
        const userToken = localStorage.getItem("userToken");

        const userOff = this.contentUserOff();
        const userOn = this.contentUserOn();

        const headerDiv = document.createElement("div");
        headerDiv.classList.add("header");
        headerDiv.innerHTML = headerHTML;
        this.shadow.appendChild(headerDiv);

        if (!userToken) {
            headerDiv.appendChild(userOff);
        } else {
            headerDiv.appendChild(userOn);
        }
    }

    //-----------------------------------------------------------------------
    contentUserOff() {
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("rightNav");
        headerDiv.innerHTML = `
            <div class="accountButtons">
                <button id="login">log in</button>
                <button id="create">create user</button>
            </div>

            <button id="cartBtn">CART</button>
        `;

        const createUserBtn = headerDiv.querySelector("#create");
        const loginBtn = headerDiv.querySelector("#login");

        createUserBtn.addEventListener('click', evt => {
            const createUserView = new CustomEvent("goToCreateUser", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(createUserView);
        });

        loginBtn.addEventListener('click', evt => {
            const loginUserEvt = new CustomEvent("goToLoginUser", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(loginUserEvt);
        });
        return headerDiv;
    }

    //-----------------------------------------------------------------------
    contentUserOn() {
        const profileImg = `${CONFIG.BASE_URL}/images/${CONFIG.API_KEY}/users/` + localStorage.getItem("userProfileImg");
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("rightNav");
        headerDiv.innerHTML = `
            <img src="${profileImg}" id="profilePic">

            <button id="cartBtn">CART</button>
        `;

        const imgBtn = headerDiv.querySelector("#profilePic");

        imgBtn.addEventListener('click', evt => {
            const userId = localStorage.getItem("userid")
            const userSettingEvt = new CustomEvent("goToUserSettings", { composed: true, bubbles: true, detail: userId });
            this.shadow.dispatchEvent(userSettingEvt);
        });

        return headerDiv;
    }
}

//-----------------------------------------------------------------------
customElements.define("product-list-view", ProductListView);
//-----------------------------------------------------------------------

const headerHTML = `
    <div class="leftNav">
        <button id="goHome">HOME</button>        
    </div>
`;

//-----------------------------------------------------------------------
const style = `
    <style>
        .product {
            display: flex;
            transition: 0.5s;
        }

        .product:hover {
            cursor: pointer;
            background-color: rgb(82, 43, 41);
            color: rgba(242, 242, 242, 1);
        }

        hr {
            margin: 0;
            border: none;     
            height: 1px;        
            background: rgb(51, 38, 29);             
        }

        h3 {
            margin: 0;
        }
     
        img {
            height: 100px;
            width: auto;
        }

        .quick-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex: 1;
            padding-left: 50px; 
        }

        .quick-info h3 {
            width: 50%;
        }

        .header {
            padding: 10px;
            background-color: rgb(205, 139, 118);
            display: flex;
            justify-content: space-between;
            height: 130px;
        }

        .leftNav {
            display: flex;
            flex-direction: column;
            justify-content: space-between; 
            height: 100%;
        }

        .rightNav {
            display: flex;
            flex-direction: column;
            justify-content: space-between; 
            height: 100%;
        }

        .accountButtons {
            max-width: 100px;
            max-height: 100px;
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        #login, #create {
            width: 100px;
            height: 50px;
            color: white;
            border: none;
            border-radius: 5px;
            background: rgb(82, 43, 41);
            transition: 0.3s;
        }

        #goHome {
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px;
            background: rgb(82, 43, 41);
            transition: 0.3s;
        }

        #cartBtn {
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px;
            background: rgb(82, 43, 41);
            transition: 0.3s;
        }

        #login:hover, #create:hover, #cartBtn:hover, #goHome:hover {
            cursor: pointer;
            background: rgba(126, 71, 68, 1);
            box-shadow: 0px 0px 10px 0px rgba(2, 2, 2, 1) inset;
        }

        #profilePic {
            width: 100px;
            height: 100px;
            border-radius: 10px;
            transition: 0.2s;
        }

        #profilePic:hover {
            cursor: pointer;
            scale: 1.05;
        }

        @media (max-width: 600px) {
            h3 {
                font-size: 15px;
            }
        }
    </style>
`;
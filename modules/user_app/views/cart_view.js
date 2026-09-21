import { errorHandler } from "../../error_handler.js";
import { showMessage } from "../../msg_handler.js";
import { CONFIG } from "../../config.js";

//-----------------------------------------------------------------------
export class CartView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render() {
        const cartListString = localStorage.getItem("cart");
        this.cartList = cartListString ? JSON.parse(cartListString) : [];
        this.updateList();
    }

    //-----------------------------------------------------------------------
    updateList() {
        this.shadow.innerHTML = style;
        this.headerComponent();
        this.navigationListners();
        if (this.cartList.length === 0) {
            return this.noItems();
        }

        let totalSum = 0;

        for (let item of this.cartList) {
            const product = this.productInfoCard(item);
            this.shadow.appendChild(product);
            totalSum += item.price * item.quantity;
        };

        const checkout = this.checkOut(totalSum);
        this.shadow.appendChild(checkout);
    }

    //-----------------------------------------------------------------------
    productInfoCard(item) {
        const productDiv = document.createElement("div");
        productDiv.classList.add("products");
        productDiv.innerHTML = `
            <div class="nameDiv">
                <div id="headerCard">
                    <h3>${item.prodNum}</h3>
                    <button id="deleteBtn">delete</button>
                </div>
                
                <p>Product name: ${item.name}</p>
                <p>Price per unit: ${item.price},- kr</p>
            </div>
            
            <div class="quantityAndStock">

                <div id="changeQuantity">
                    <button id="numberDown">-</button>
                    <p id="quantityNumber">${item.quantity}</p>
                    <button id="numberUp">+</button>
                </div>

                <p>stock: ${item.stock}</p>

            </div>

            <div class="totalPrice">
                <p>Total price: ${item.price * item.quantity},- kr</p>
            </div>
        `;
        this.quantityListeners(productDiv, item);
        this.removeProduct(productDiv, item);

        return productDiv;
    }

    //-----------------------------------------------------------------------
    quantityListeners(selectDiv, item) {
        const upNumber = selectDiv.querySelector("#numberUp");
        const downNumber = selectDiv.querySelector("#numberDown");

        upNumber.addEventListener('click', evt => {
            if (item.quantity >= item.stock) {
                return errorHandler("There is only " + item.stock + " items of this product");
            }
            item.quantity += 1;
            localStorage.setItem("cart", JSON.stringify(this.cartList));
            this.updateList();
        });

        downNumber.addEventListener('click', evt => {
            if (item.quantity <= 1) {
                return errorHandler("Need to delete product insted");
            }
            item.quantity -= 1;
            localStorage.setItem("cart", JSON.stringify(this.cartList));
            this.updateList();
        });
    }

    //-----------------------------------------------------------------------
    removeProduct(selectDiv, item) {
        const delBtn = selectDiv.querySelector("#deleteBtn");
        delBtn.addEventListener('click', evt => {
            this.cartList = this.cartList.filter(product => product.prodNum !== item.prodNum);
            localStorage.setItem("cart", JSON.stringify(this.cartList));
            this.updateList();
            showMessage(`Deleted ${item.name} from cart`);
        });
    }

    //-----------------------------------------------------------------------
    checkOut(number) {
        const checkOutDiv = document.createElement("div");
        checkOutDiv.classList.add("checkout");
        checkOutDiv.innerHTML = `
            <h1>Total order price: ${number},- kr</h1>
            <button id="checkoutBtn">Proceed to checkout</button>
        `;
        const checkoutBtn = checkOutDiv.querySelector("#checkoutBtn");

        checkoutBtn.addEventListener('click', evt => {
            const checkoutEvt = new CustomEvent("goToCheckout", { composed: true, bubbles: true, detail: number });
            checkoutEvt.cartList = this.cartList;
            checkOutDiv.dispatchEvent(checkoutEvt);
        });
        return checkOutDiv;
    }

    //-----------------------------------------------------------------------
    noItems() {
        const noItemsDiv = document.createElement("div");
        noItemsDiv.classList.add("no-items");
        noItemsDiv.innerHTML = `
            <h2>There is currently no items in your cart.</h2>
        `;
        this.shadow.appendChild(noItemsDiv);
    }

    //-----------------------------------------------------------------------
    navigationListners() {
        const homeBnt = this.shadow.getElementById("goHome");
        const emptyBtn = this.shadow.getElementById("emptyBtn");

        emptyBtn.addEventListener('click', evt => {
            const cart = localStorage.getItem("cart");

            if (!cart) {
                return errorHandler("Your cart is already empty");
            } else {
                localStorage.removeItem("cart");
                this.render();
                showMessage("Cart is now empty");
            }
        });

        homeBnt.addEventListener('click', evt => {
            const goHomeEvt = new CustomEvent("goHome", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goHomeEvt);
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

            <button id="emptyBtn">empty cart</button>
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

            <button id="emptyBtn">empty cart</button>
        `;

        const imgBtn = headerDiv.querySelector("#profilePic");

        imgBtn.addEventListener('click', evt => {
            const userId = localStorage.getItem("userid");
            const userSettingEvt = new CustomEvent("goToUserSettings", { composed: true, bubbles: true, detail: userId });
            this.shadow.dispatchEvent(userSettingEvt);
        });

        return headerDiv;
    }
}

//-----------------------------------------------------------------------
customElements.define("cart-view", CartView);

//-----------------------------------------------------------------------
const headerHTML = `
    <div class="leftNav">
        <button id="goHome">HOME</button>
            
    </div>
`;

//-----------------------------------------------------------------------
const style = `
    <style>
        * {
            margin: 0;
        }

        .no-items {
            margin: 10px;
        }

        .products {
            background-color: rgb(205, 139, 118);
            border-radius: 20px;
            margin: 10px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px; 
        }

        #headerCard {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .nameDiv {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .quantityAndStock {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        #quantityNumber {
            width: 30px; 
            text-align: center;
        }

        #changeQuantity {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        #numberDown, #numberUp {
            height: 30px;
            width: 30px;
            color: white;
            border: none;
            border-radius: 5px;
            background: rgb(82, 43, 41);
            transition: 0.3s;
        }

        #numberDown:hover, #numberUp:hover {
            cursor: pointer;
            background: rgba(126, 71, 68, 1);
            box-shadow: 0px 0px 10px 0px rgba(2, 2, 2, 1) inset;
        }

        #deleteBtn {
            border: none;
            border-radius: 5px;
            color: white;
            padding: 10px;
            background: rgba(163, 8, 0, 1);
            transition: 0.3s;
        }

        #deleteBtn:hover {
            cursor: pointer;
            box-shadow: 0px 0px 10px 0px rgba(2, 2, 2, 1) inset;
        }

        .totalPrice {
            align-self: flex-end;
        }

        .checkout {
            position: sticky;
            bottom: 0;
            background-color: rgb(205, 139, 118);
            border: solid 10px rgba(126, 71, 68, 1);
            padding: 20px;
            text-align: center;
            box-shadow: 0px -10px 5px rgba(2, 2, 2, 0.25);
        }

        #checkoutBtn {
            width: 150px;
            color: white;
            border: none;
            border-radius: 5px;
            background: rgb(82, 43, 41);
            transition: 0.3s;
            padding: 10px;
            margin: 10px;
        }

        #checkoutBtn:hover {
            cursor: pointer;
            background: rgba(126, 71, 68, 1);
            box-shadow: 0px 0px 10px 0px rgba(2, 2, 2, 1) inset;
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

        #emptyBtn {
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px;
            background: rgb(82, 43, 41);
            transition: 0.3s;
        }

        #login:hover, #create:hover, #emptyBtn:hover, #goHome:hover {
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
    </style>
`;

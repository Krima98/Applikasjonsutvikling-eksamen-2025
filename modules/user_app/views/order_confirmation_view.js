import { convertDate } from "../../utils.js";
import { CONFIG } from "../../config.js";

//-----------------------------------------------------------------------
export class OrderConfirmationView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render(data, shipData) {
        this.shadow.innerHTML = style
        this.headerComponent();
        this.navigationListners();
        this.orderHtml(data, shipData);
    }

    //-----------------------------------------------------------------------
    orderHtml(data, shipData) {
        const shippingDate = this.findEstShipDate(data);
        const shippingMethod = this.findShipData(data, shipData);
        const totalSum = this.totalSumInOrder(data);
        const phone = !data.record.phone ? "no number given" : data.record.phone;

        const myDiv = document.createElement("div");
        myDiv.classList.add("order");
        myDiv.innerHTML = `
            <div class="order-confirmation-header">
                <h1>ORDER CONFIRMATION</h1>
                <h3 id="orderNumb">${data.record.ordernumber}</h3>
            </div>

            <div class="customer">
                <h2>Customer information</h2>
                <p><span>Name:</span> ${data.record.customer_name}</p>
                <p><span>Email:</span> ${data.record.email}</p>
                <p><span>Phone:</span> ${phone}</p>
                <p><span>Adress:</span> ${data.record.street}, ${data.record.city}, ${data.record.zipcode}, ${data.record.country}</p>
            </div>
            <hr>
            <div id="products">
                <h2>Products</h2>
                
            </div>
            <hr>
            <div id="priceAndShipping">
                <h2>Price and Shipping</h2>
                <p><span>Shipping method:</span> ${shippingMethod.shipType} (Price: ${shippingMethod.shipPrice},- kr)</p>
                <p><span>Total order price:</span> ${totalSum + Number(shippingMethod.shipPrice)},- kr (with shipping)</p>
                <p><span>Estimated order shipping:</span> ${shippingDate}</p>
            </div>        
        `;

        this.shadow.appendChild(myDiv);
        this.appendProducts(data);
    }

    //-----------------------------------------------------------------------
    appendProducts(data) {
        const productList = JSON.parse(data.record.content);

        const productDiv = this.shadow.getElementById("products");

        for (let item of productList) {
            const product = this.productCard(item);
            productDiv.appendChild(product);
        }
    }

    //-----------------------------------------------------------------------
    productCard(item) {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product-info");
        productDiv.innerHTML = `
            <div class="product-name">
                <p>${item.prodNum}</p>
                <p>${item.name}</p>
            </div>

            <div class="product-quantity">
                <p>Quantity</p>
                <p>${item.quantity}</p>
            </div>

            <div class="product-price">
                <p>Price</p>
                <p>${item.price},- kr</p>
            </div>
            
            <div class="product-total">
                <p>Total</p>
                <p>${item.price * item.quantity},- kr</p>
            </div>
        `;
        return productDiv;
    }

    //-----------------------------------------------------------------------
    totalSumInOrder(data) {
        const productList = JSON.parse(data.record.content);
        let totalSum = 0;

        for (let item of productList) {

            totalSum += item.price * item.quantity;
        }
        return totalSum
    }

    //-----------------------------------------------------------------------
    findEstShipDate(data) {
        const productList = JSON.parse(data.record.content);
        const dateList = [];
        const today = new Date();

        for (let item of productList) {
            dateList.push(new Date(item.estShip));
        }

        const sortDateList = dateList.sort((date, dateTwo) => {
            return date - dateTwo;
        });

        const latestDate = sortDateList[sortDateList.length - 1];

        if (latestDate > today) {
            return `${convertDate(latestDate)}`;
        } else {
            return `Today ${convertDate(today)}`;
        }
    }

    //-----------------------------------------------------------------------
    findShipData(data, shipData) {
        const orderShipId = data.record.shipping_id;
        for (let method of shipData) {
            if (method.shipId == orderShipId) {
                return method;
            }
        }
    }

    //-----------------------------------------------------------------------
    navigationListners() {
        const homeBtn = this.shadow.getElementById("goHome");

        homeBtn.addEventListener('click', evt => {
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
customElements.define("order-confirmation", OrderConfirmationView);
//-----------------------------------------------------------------------

const headerHTML = `
    <div class="leftNav">
        <button id="goHome">HOME</button>            
    </div>
`;

//-----------------------------------------------------------------------
const style = `
    <style>
        p {
            line-height: 1.5;
        }

        span {
            font-weight: bold;
        }

        * {
            margin: 0;
        }

        .order-confirmation-header {
            text-align: center;
        }

        #orderNumb {
            color: rgb(69, 69, 69);
        }
        
        .products {
            display: flex;
            flex-direction: column;
            gap: 100px;
        }

        .product-info {
            display: flex;
            margin-top: 14px;
            margin-bottom: 14px;
            text-align: center;
            align-items: center;
        }

        .order {
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding: 20px;
            background-color: white;
            height: 100vh;
        }

        .product-name {
            flex: 2;
        }

        .product-quantity, .product-price, .product-total {
            flex: 1; 
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

        #login:hover, #create:hover, #goHome:hover {
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

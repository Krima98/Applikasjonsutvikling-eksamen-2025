import { CONFIG } from "../../config.js";
import { convertDate } from "../../utils.js";

//-----------------------------------------------------------------------
export class OrderDetailUserView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render(order, shipData) {
        this.shadow.innerHTML = style;
        this.headerComponent();
        this.navigationListners();
        this.orderCard(order, shipData);
    }

    //-----------------------------------------------------------------------
    orderCard(order, shipData) {
        const phone = !order.phone ? "no number" : order.phone;
        const totalProductSum = this.totalSumProductsOrder(order);
        const shippingMethod = this.findShipData(order, shipData);
        const shippingDate = this.findEstShipDate(order);
        const orderstatus = this.orderStatus(order, shippingDate);

        const orderDiv = document.createElement("div");
        orderDiv.classList.add("order");
        orderDiv.innerHTML = `
            <div class="order-header">
                <p><span>ORDER RECIVED:</span> ${convertDate(order.orderDate)}</p>
                <p>Status: ${orderstatus}</p>
                <h1>${order.orderNumb}</h1>
            </div>

            <div class="customer">
                <h2>Customer information</h2>
                <p><span>Name:</span> ${order.personName}</p>
                <p><span>Email:</span> ${order.email}</p>
                <p><span>Phone:</span> ${phone}</p>
                <p><span>Adress:</span> ${order.street}, ${order.city}, ${order.zipcode}, ${order.country}</p>
            </div>
            <hr>
            <div id="products">
                <h2>Products</h2>
                
            </div>
            <hr>
            <div id="priceAndShipping">
                <h2>Price and Shipping</h2>
                <p><span>Shipping method:</span> ${shippingMethod.shipType} (Price: ${shippingMethod.shipPrice},- kr)</p>
                <p><span>Total Order Price:</span> ${totalProductSum + Number(shippingMethod.shipPrice)},- kr (with shipping)</p>
                <p><span>Estimated order shipping:</span> ${convertDate(shippingDate)}</p>
            </div>        
        `;

        this.shadow.appendChild(orderDiv);
        this.appendProducts(order);
    }

    //-----------------------------------------------------------------------
    appendProducts(order) {
        const productsList = JSON.parse(order.products);

        const productDiv = this.shadow.getElementById("products");

        for (let item of productsList) {
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
    findEstShipDate(order) {
        const productList = JSON.parse(order.products);
        const dateList = [];
        const orderDate = new Date(order.orderDate);

        for (let item of productList) {
            dateList.push(new Date(item.estShip));
        }

        const sortDateList = dateList.sort((date, dateTwo) => {
            return date - dateTwo;
        });

        const latestDate = sortDateList[sortDateList.length - 1];

        if (latestDate > orderDate) {
            return latestDate;
        } else {
            return orderDate;
        }
    }

    //-----------------------------------------------------------------------
    totalSumProductsOrder(order) {
        const productList = JSON.parse(order.products)
        let totalSum = 0;

        for (let item of productList) {
            totalSum += item.price * item.quantity;
        }
        return totalSum;
    }

    //-----------------------------------------------------------------------
    findShipData(order, shipData) {
        const orderShipId = order.shipId;
        for (let method of shipData) {
            if (method.shipId == orderShipId) {
                return method;
            }
        }
    }

    //-----------------------------------------------------------------------
    orderStatus(order, shipDay) {
        const orderRecived = new Date(order.orderDate);
        const today = new Date();
        const estimatedShipDay = new Date(shipDay);

        if (estimatedShipDay > orderRecived) {
            return `shipping date is ${convertDate(estimatedShipDay)}`;
        } else if (orderRecived.toDateString() == today.toDateString()) {
            return "shipping today";
        } else {
            return "shipped";
        }
    }

    //-----------------------------------------------------------------------
    navigationListners() {

        const cartBtn = this.shadow.getElementById("cartBtn");
        const homeBtn = this.shadow.getElementById("goHome");
        const goBackBtn = this.shadow.getElementById("goBackBtn");

        homeBtn.addEventListener('click', evt => {
            const goHomeEvt = new CustomEvent("goHome", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goHomeEvt);
        });

        cartBtn.addEventListener('click', evt => {
            const cartViewEvt = new CustomEvent("goToCart", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(cartViewEvt);
        });

        goBackBtn.addEventListener('click', evt => {
            const goBackToSettingsEvt = new CustomEvent("goBackOrderList", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goBackToSettingsEvt);
        });
    }

    //-----------------------------------------------------------------------
    headerComponent() {
        const userOn = this.contentUserOn();

        const headerDiv = document.createElement("div");
        headerDiv.classList.add("header");
        headerDiv.innerHTML = headerHTML;
        this.shadow.appendChild(headerDiv);
        headerDiv.appendChild(userOn);
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
customElements.define("order-detail-user", OrderDetailUserView);
//-----------------------------------------------------------------------

const headerHTML = `
    <div class="leftNav">
        <button id="goHome">HOME</button>

        <button id="goBackBtn">Back</button>
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

        hr {
            margin: 0;
            border: none;
            height: 1px;
            background: rgba(0, 0, 0, 1);
        }

        .order-header {
            display: flex;
            flex-direction: column;
            align-items: center;
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
        }

        .product-name {
            flex: 2;
        }

        .product-quantity, .product-price, .product-total {
            flex: 1; 
        }

        span {
            font-weight: bold;
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

        #goHome, #goBackBtn {
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

        #login:hover, #create:hover, #cartBtn:hover, #goHome:hover, #goBackBtn:hover {
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
    </style>
`;

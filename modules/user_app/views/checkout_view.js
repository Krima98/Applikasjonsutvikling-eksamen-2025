import { errorHandler } from "../../error_handler.js";
import { sanitizeString } from "../../utils.js";
import { CONFIG } from "../../config.js";

//--------------------------------------------------------------
export class CheckoutView extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //--------------------------------------------------------------
    render(shipData, orderList, totalSum) {
        this.shadow.innerHTML = style;
        this.headerComponent();
        this.navigationListners();
        this.userInputForm(shipData, orderList);
        this.orderPriceInfo(totalSum, shipData);
        this.selectShippingListner(shipData, totalSum);
        this.sendOrder(orderList);
    }

    //--------------------------------------------------------------
    userInputForm(shipData) {

        const userInfo = localStorage.getItem("userInfo");
        const userParse = JSON.parse(userInfo);
        const user = !userParse ? {} : userParse;
        const orderForm = document.createElement("div");
        orderForm.classList.add("orderForm")
        orderForm.innerHTML = `
            <h1>Checkout Information</h1>

            <div id="inputBox">
                <span>Full Name</span>
                <input id="inpName" type="text" placeholder="Full Name" value="${user.full_name || ""}">
            </div>
            <div id="inputBox">
                <span>Phone Number</span>
                <input id="inpPhone" type="number" placeholder="Phone">
            </div>
            <div id="inputBox">
                <span>Email</span>
                <input id="inpEmail" type="text" placeholder="Email" value="${user.username || ""}">
            </div>
            <div id="inputBox">
                <span>Country</span>
                <input id="inpCountry" type="text" placeholder="Country" value="${user.country || ""}">
            </div>
            <div id="inputBox">
                <span>City</span>
                <input id="inpCity" type="text" placeholder="City" value="${user.city || ""}">
            </div>
            <div id="inputBox">
                <span>Street</span>
                <input id="inpStreet" type="text" placeholder="Street" value="${user.street || ""}">
            </div>
            <div id="inputBox">
                <span>Zipcode</span>
                <input id="inpZip" type="number" placeholder="Zipcode" value="${user.zipcode || ""}">
            </div>
            
            <h1>Choose Shipping Method</h1>

            <select id="shipTypeMenu" name="shipping_id">
                <option value="">Choose shipType</option>
            </select>
        `;
        this.shadow.appendChild(orderForm);
        this.appendOptionsSelect(shipData);
    }

    //--------------------------------------------------------------
    appendOptionsSelect(shipData) {

        const dropDownMenu = this.shadow.getElementById("shipTypeMenu");

        for (let item of shipData) {
            const option = document.createElement("option");
            option.value = item.shipId;
            option.innerText = `${item.shipType} / price: ${item.shipPrice},- kr`;
            dropDownMenu.appendChild(option);
        }
    }

    //--------------------------------------------------------------
    selectShippingListner(shipData, totalSum) {

        const selectShip = this.shadow.getElementById("shipTypeMenu");
        const textTotalOrderPrice = this.shadow.getElementById("totalOrderPrice");
        const orderPrice = totalSum;

        selectShip.addEventListener('change', (evt) => {
            const shipId = evt.target.value;

            for (let method of shipData) {
                if (method.shipId == shipId) {
                    textTotalOrderPrice.innerText = `Total with shipping: ${orderPrice + Number(method.shipPrice)},- kr`;
                }
            }
        });
    }

    //--------------------------------------------------------------
    orderPriceInfo(totalSum) {

        const orderPrice = totalSum;
        const priceInfoDiv = document.createElement("div");
        priceInfoDiv.classList.add("priceInfo");
        priceInfoDiv.innerHTML = `
            <h1 id="totalOrderPrice">Total with shipping: ${orderPrice},- kr</h1>
            <button id="sendBtn">Place Order</button>
        `;
        this.shadow.appendChild(priceInfoDiv);
    }

    //--------------------------------------------------------------
    validateCheckOutForm(orderList) {

        const fullName = this.shadow.getElementById("inpName");
        const street = this.shadow.getElementById("inpStreet");
        const city = this.shadow.getElementById("inpCity");
        const phone = this.shadow.getElementById("inpPhone");
        const zipcode = this.shadow.getElementById("inpZip");
        const country = this.shadow.getElementById("inpCountry");
        const email = this.shadow.getElementById("inpEmail");
        const shipType = this.shadow.getElementById("shipTypeMenu");

        const onlyLettersName = /^[a-zA-Z\s-]+$/;
        const onlyLettersCountry = /^[a-zA-Z\s]+$/;

        if (!fullName.value.trim()) {
            return errorHandler("Fill out full name");
        } else if (!onlyLettersName.test(fullName.value)) {
            return errorHandler("Your name can't have numbers");
        } else if (fullName.value.trim().split(" ").length < 2) {
            return errorHandler("Need first and last name");
        }

        if (!email.value.trim()) {
            return errorHandler("Need to fill out email");
        } else if (!email.value.includes("@")) {
            return errorHandler("Email needs @");
        }

        if (!country.value.trim()) {
            return errorHandler("Need to fill out country");
        } else if (!onlyLettersCountry.test(country.value)) {
            return errorHandler("Country can't have numbers or symbols");
        }

        if (!city.value.trim()) { return errorHandler("Need to fill out city"); }
        if (!street.value.trim()) { return errorHandler("Need to fill out street!"); }
        if (!zipcode.value.trim()) { return errorHandler("Need to fill out zipcode"); }


        return {
            customer_name: sanitizeString(fullName.value),
            street: sanitizeString(street.value),
            city: sanitizeString(city.value),
            phone: phone.value,
            zipcode: zipcode.value,
            country: sanitizeString(country.value),
            email: sanitizeString(email.value),
            shipping_id: shipType.value,
            content: JSON.stringify(orderList),
        };
    }

    //--------------------------------------------------------------
    sendOrder(orderList) {

        const sendBtn = this.shadow.getElementById("sendBtn");

        sendBtn.addEventListener("click", evt => {
            const orderInfo = this.validateCheckOutForm(orderList);
            if (!orderInfo) {
                return;
            }

            const sendOrder = new CustomEvent("sendOrder", { composed: true, bubbles: true });
            sendOrder.orderForm = orderInfo;
            localStorage.removeItem("cart");
            this.shadow.dispatchEvent(sendOrder);
        });
    }

    //--------------------------------------------------------------
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

    //--------------------------------------------------------------
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

    //--------------------------------------------------------------
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

    //--------------------------------------------------------------
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
            const userId = localStorage.getItem("userid");
            const userSettingEvt = new CustomEvent("goToUserSettings", { composed: true, bubbles: true, detail: userId });
            this.shadow.dispatchEvent(userSettingEvt);
        });

        return headerDiv;
    }
}

//--------------------------------------------------------------
customElements.define("checkout-page", CheckoutView);

//--------------------------------------------------------------
const headerHTML = `
    <div class="leftNav">
        <button id="goHome">HOME</button>        
    </div>
    `;

//--------------------------------------------------------------
const style = `
    <style>
        h1 {
            margin-top: 10px;
            margin-bottom: 10px;
        }

        #inputBox {
            display: flex;
            align-items: center;
        }

        span {
            flex: 1;
        }

        .orderForm, .priceInfo {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 0px 30px; 
        }

        input[type=text], input[type=number], select {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 4px;
            box-sizing: border-box;
            flex: 3;
            }

        input[type="text"]:focus, input[type=number]:focus {
            outline: none;
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }

        select:focus {
            outline: none;
        }

        input[type="text"]:hover, input[type=number]:hover, select:hover {
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }

        #sendBtn {
            width: 100px;
            align-self: center;
            color: white;
            border: none;
            border-radius: 5px;
            background: rgb(82, 43, 41);
            transition: 0.3s;
            padding: 10px;
        }

        #sendBtn:hover {
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
            h1 {
                font-size: 25px;
            }
        }
    </style>
`;

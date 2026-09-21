import { convertDate } from "../../utils.js";
import { CONFIG } from "../../config.js";

//-----------------------------------------------------------------------
export class OrderUserView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render(data) {
        this.shadow.innerHTML = style;
        this.headerComponent();
        this.navigationListners();
        this.displayOrderCards(data);
    }

    //-----------------------------------------------------------------------
    displayOrderCards(data) {
        const orderDiv = document.createElement("div");
        orderDiv.classList.add("orders");
        this.shadow.appendChild(orderDiv);

        data.sort(function (number, numberTwo) {
            return number.orderId - numberTwo.orderId;
        });

        if (data.length == 0) {
            return this.noOrders();
        }

        for (let item of data) {
            const orderCard = this.orderListCard(item);
            orderDiv.appendChild(orderCard);

            orderCard.addEventListener('click', evt => {
                const order = item;
                const orderEvt = new CustomEvent("goToOrderDetail", { composed: true, bubbles: true, detail: order });
                this.shadow.dispatchEvent(orderEvt);
            });
        }
    }

    //-----------------------------------------------------------------------
    noOrders() {
        const orderDiv = this.shadow.querySelector(".orders");

        const noOrderDiv = document.createElement("div");
        noOrderDiv.classList.add("no-orders");
        noOrderDiv.innerHTML = `
            <h2>Currently no orders</h1>
        `;

        orderDiv.appendChild(noOrderDiv);
    }

    //-----------------------------------------------------------------------
    orderListCard(item) {

        const orderDiv = document.createElement("div");
        orderDiv.classList.add("order-card");
        orderDiv.innerHTML = `
            <h2>${item.orderNumb}</h2>
            <p>order date: ${convertDate(item.orderDate)}</p>
            <hr> 
        `;
        return orderDiv;
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
            const goBackToSettingsEvt = new CustomEvent("goBackSettings", { composed: true, bubbles: true });
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
customElements.define("order-user-view", OrderUserView);
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
        h2 {
            margin: 0;
            padding: 10px;
        }

        .order-card {
            text-align: center;
            transition: 0.5s;
        }

        .order-card:hover {
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

        #profilePic:hover {
            cursor: pointer;
            scale: 1.05;
        }
    </style>
`;

import { convertDate } from "../../utils.js";
//-----------------------------------------------------------------------

export class OrdersAdmin extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render(data) {
        this.shadow.innerHTML = style;
        this.makeHeader();
        this.displayOrder(data);
        this.navigationListners();
    }

    //-----------------------------------------------------------------------
    makeHeader() {
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("header");
        headerDiv.innerHTML = `
            <h1>Orders</h1>
            <div class="headerButtons">
                <button id="goHome">HOME</button>
            </div>
        `;
        this.shadow.appendChild(headerDiv);
    }

    //-----------------------------------------------------------------------
    displayOrder(data) {
        const orderDiv = document.createElement("div");
        orderDiv.classList.add("orders");
        this.shadow.appendChild(orderDiv);

        if (data.length == 0) {
            this.noOrders()
        }

        for (let item of data) {
            const orderCard = this.orderCard(item);
            orderDiv.appendChild(orderCard);
        }
    }

    //--------------------------------------------------------------
    noOrders() {
        const orderDiv = this.shadow.querySelector(".orders");

        const noOrdersDiv = document.createElement("div");
        noOrdersDiv.classList.add("no-orders");
        noOrdersDiv.innerHTML = `
            <h2>Currently no orders</h2>
        `;
        orderDiv.appendChild(noOrdersDiv);
    }

    //-----------------------------------------------------------------------
    orderCard(item) {
        const shippingDate = this.findEstShipDate(item);
        const orderStatus = this.orderStatus(item, shippingDate);
        const isMember = !item.userId ? "No" : `Yes (user id: ${item.userId})`;
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("order");
        cardDiv.innerHTML = `
            <div class="infoOrder">

                <div class="infoText">
                    <p><span>User:</span> ${item.personName}</p>
                    <p><span>Order date:</span> ${convertDate(item.orderDate)}</p>
                    <p><span>Order status:</span> ${orderStatus}</p>
                    <p><span>Member: </span>${isMember}</p>
                </div>

                <button id="deleteBtn">DELETE</button> 

            </div>
            <hr>
        `;

        const deleteBtn = cardDiv.querySelector("#deleteBtn");

        deleteBtn.addEventListener('click', evt => {
            const getorderIdEvt = new CustomEvent("deleteOrder", { composed: true, bubbles: true, detail: item.orderId });
            this.shadow.dispatchEvent(getorderIdEvt);
            cardDiv.remove();
        });

        return cardDiv;
    }

    //-----------------------------------------------------------------------
    findEstShipDate(order) {
        const productList = JSON.parse(order.products)
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
        const homeBtn = this.shadow.getElementById("goHome");

        homeBtn.addEventListener('click', evt => {
            const goHomeEvt = new CustomEvent("goHome", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goHomeEvt);
        });
    }
}

//-----------------------------------------------------------------------
customElements.define("orders-admin", OrdersAdmin);
//-----------------------------------------------------------------------

const style = `
    <style>
        p {
            margin: 0;
            line-height: 1.5;
        }

        span {
            font-weight: bold;
        }

        no-orders h2 {
            margin: 0;
        }

        .no-orders {
            margin: 10px;
        }

        .header {
            color: rgb(233, 233, 233);
            background-color: rgba(15, 15, 15, 1);
            padding: 10px;
        }

        .infoOrder {
            display: flex;
            justify-content: space-between;
            margin: 10px;
        }

        .infoText {
            margin: 10px 0px;
        }

        hr {
            margin: 0;
            border: none;
            height: 1px;
            background: rgba(0, 0, 0, 1);
        }

        #deleteBtn {
            width: 100px;
            align-self: center;
            border: none;
            border-radius: 5px;
            background: rgba(255, 66, 66, 1);
            transition: 0.3s;
            padding: 10px; 
            font-weight: bold;
        }

        #goHome {
            border: none;
            border-radius: 5px;
            height: 40px;
            width: 100px;
            padding: 10px; 
            color: black;
            background: rgba(46, 228, 107, 1);
            transition: 0.3s;
        }

        #deleteBtn:hover, #goHome:hover {
            cursor: pointer;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 1) inset;          
        }
    </style>
`;
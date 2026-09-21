export class AdminHomeView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render(data) {
        this.shadow.innerHTML = style;
        this.makeHeader(data);
        this.displayCategory();
        this.navigationListner();
    }

    //-----------------------------------------------------------------------
    makeHeader(data) {
        const myDiv = document.createElement("div");
        myDiv.classList.add("header");
        myDiv.innerHTML = `
            <h1>SUKKERGRIS ADMIN PAGE</h1>
            <img src="${data.logindata.thumb}" alt="img">
        `;
        this.shadow.appendChild(myDiv);
    }

    //-----------------------------------------------------------------------
    displayCategory() {

        const categoryDiv = document.createElement("div");
        categoryDiv.classList.add("categoryMenu");
        this.shadow.appendChild(categoryDiv);

        const categoryList = [
            { name: "products", id: "productsBtn" },
            { name: "orders", id: "ordersBtn" },
            { name: "users", id: "usersBtn" },
            { name: "comments/reviews", id: "commentsBtn" }
        ];

        for (let item of categoryList) {
            const categoryCard = this.categoryCard(item);
            categoryDiv.appendChild(categoryCard);
        }
    }

    //-----------------------------------------------------------------------
    categoryCard(item) {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("category");
        cardDiv.innerHTML = `
            <h1 id="${item.id}">${item.name}</h1>
            <hr>
        `;
        return cardDiv;
    }

    //-----------------------------------------------------------------------
    navigationListner() {

        const productBtn = this.shadow.getElementById("productsBtn");
        const ordersBtn = this.shadow.getElementById("ordersBtn");
        const userBtn = this.shadow.getElementById("usersBtn");
        const commentsBtn = this.shadow.getElementById("commentsBtn");

        productBtn.addEventListener('click', evt => {
            const goToAdminProductsEvt = new CustomEvent("productViewAdmin", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goToAdminProductsEvt);
        });

        ordersBtn.addEventListener('click', evt => {
            const goToAdminOrdersEvt = new CustomEvent("orderViewAdmin", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goToAdminOrdersEvt);
        });

        userBtn.addEventListener('click', evt => {
            const goToAdminUsersEvt = new CustomEvent("userViewAdmin", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goToAdminUsersEvt);
        });

        commentsBtn.addEventListener('click', evt => {
            const goToCommentsAndReviewEvt = new CustomEvent("commentViewAdmin", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goToCommentsAndReviewEvt);
        });
    }
}

//-----------------------------------------------------------------------
customElements.define("home-admin", AdminHomeView);
//-----------------------------------------------------------------------

const style = `
    <style>
        .header {
            display: flex;
            justify-content: space-between;
            color: rgb(233, 233, 233);
            background-color: rgba(15, 15, 15, 1);
            padding: 10px;
        }

        img {
            border-radius: 10px;
            height: 80px;
            width: 80px;
        }

        .category {
            transition: 0.5s;
        }

        .category:hover {
            cursor: pointer;
            background-color: rgba(46, 228, 107, 1);
        }

        h1 {
            margin: 0;
            padding: 20px;
            text-align: center;
        }

        hr {
            margin: 0;
            border: none;
            height: 1px;
            background: rgba(0, 0, 0, 1);
        }
    </style>
`;


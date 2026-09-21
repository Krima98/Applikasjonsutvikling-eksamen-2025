import { errorHandler } from "../../error_handler.js";
import { CONFIG } from "../../config.js";

//-----------------------------------------------------------------------
export class CategoryView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render(data) {
        this.shadow.innerHTML = style;
        this.headerComponent();
        this.messageViewButton();
        if (!data) {
            return errorHandler("Could not connect to the endpoint, please try again");
        }
        this.listCategory(data);
        this.navigationListners();
    }

    //-----------------------------------------------------------------------
    listCategory(data) {

        const categoryDiv = document.createElement("div");
        categoryDiv.classList.add("categories");
        this.shadow.appendChild(categoryDiv);

        for (let item of data) {
            const categoryCard = this.categoryCard(item);
            categoryDiv.appendChild(categoryCard);

            categoryCard.addEventListener('click', evt => {
                const categoryEvt = new CustomEvent("categorySelected", { composed: true, bubbles: true, detail: item.catId });
                this.shadow.dispatchEvent(categoryEvt);
            });
        }
    }

    //-----------------------------------------------------------------------
    categoryCard(item) {

        const categoryCardDiv = document.createElement("div");
        categoryCardDiv.classList.add("category-card");
        categoryCardDiv.innerHTML = `
            <h1>${item.catName}</h1>
            <hr>
        `;
        return categoryCardDiv;
    }

    //-----------------------------------------------------------------------
    navigationListners() {

        const searchBtn = this.shadow.getElementById("searchBtn");
        const userInput = this.shadow.getElementById("searchInp");
        const cartBtn = this.shadow.getElementById("cartBtn");

        cartBtn.addEventListener('click', evt => {
            const cartViewEvt = new CustomEvent("goToCart", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(cartViewEvt);
        });

        searchBtn.addEventListener('click', evt => {
            const productSearchEvt = new CustomEvent("searchProduct", { composed: true, bubbles: true, detail: userInput.value });
            this.shadow.dispatchEvent(productSearchEvt);
        });
    }

    //-----------------------------------------------------------------------
    messageViewButton() {
        if (localStorage.getItem("userToken")) {

            const messageBtn = document.createElement("button");
            messageBtn.id = "messageBtn";
            messageBtn.innerText = "message page";

            const leftHeaderDiv = this.shadow.querySelector(".leftNav");
            leftHeaderDiv.appendChild(messageBtn);

            messageBtn.addEventListener('click', evt => {
                const goToMessageEvt = new CustomEvent("goToMessage", { composed: true, bubbles: true });
                this.shadow.dispatchEvent(goToMessageEvt);
            });
        }
    }

    //-----------------------------------------------------------------------
    headerComponent() {
        const userToken = localStorage.getItem("userToken");
        const userOff = this.contentUserOff();
        const userOn = this.contentUserOn();
        const headerDiv = document.createElement("div");
        headerDiv.innerHTML = headerHTML;
        headerDiv.classList.add("header");

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
            const userId = localStorage.getItem("userid");
            const userSettingEvt = new CustomEvent("goToUserSettings", { composed: true, bubbles: true, detail: userId });
            this.shadow.dispatchEvent(userSettingEvt);
        });

        return headerDiv;
    }
}

//-----------------------------------------------------------------------
customElements.define("category-view", CategoryView);

//-----------------------------------------------------------------------
const headerHTML = `
    <div class="leftNav">
        <div class="searcfield">
            <input type="text" name="text" id="searchInp" placeholder="search for a product">
            <button id="searchBtn">search</button>
        </div>
    </div>
`;

//-----------------------------------------------------------------------
const style = `
    <style>
        .header {
            display: flex;
            justify-content: space-between;
        }

        hr {
            margin: 0;
            border: none;
            height: 1px;
            background: rgb(51, 38, 29);
        }

        .category-card:hover {
            cursor: pointer;
            background-color: rgb(82, 43, 41);
            color: rgba(242, 242, 242, 1);
        }

        .category-card {
            transition: 0.5s;
        }

        h1 {
            margin: 0;
            padding: 10px;
            text-align: center;
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
            flex-direction: column-reverse;
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

        #login,#create {
            width: 100px;
            height: 50px;
            color: white;
            border: none;
            border-radius: 5px;
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

        #login:hover, #create:hover, #cartBtn:hover, #messageBtn:hover {
            cursor: pointer;
            background: rgba(126, 71, 68, 1);
            box-shadow: 0px 0px 10px 0px rgba(2, 2, 2, 1) inset;
        }

        #messageBtn {
            color: white;
            width: 130px;
            border: none;
            border-radius: 5px;
            padding: 10px;
            background: rgb(82, 43, 41);
            transition: 0.3s;
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

        .searcfield {
            background-color: white;
            padding: 5px;
            border-radius: 5px;
        }

        #searchBtn {
            border: none;
            cursor: pointer;
            border-radius: 4px;
            background: rgb(82, 43, 41);
            padding: 5px;
            color: white;
        }

        #searchBtn:hover {
            background: rgba(126, 71, 68, 1);
        }

        #searchInp {
            border: none;
            border-radius: 4px;
            padding: 4px;
            color: rgba(126, 71, 68, 1);
        }

        #searchInp:hover {
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }

        #searchInp:focus {
            outline: none;
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }
    </style>
`;




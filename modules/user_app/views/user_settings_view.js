import { CONFIG } from "../../config";

export class UserSettingView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render(data) {
        this.shadow.innerHTML = style
        this.headerComponent();
        this.makeMenu();
        this.navigationListners();
        this.changeUserListener();
        this.userLogOutListener();
        this.deleteUserListener();
        this.orderListener();
        this.reviewsListener();
        this.userInfoCard(data);
    }

    //-----------------------------------------------------------------------
    makeMenu() {
        const menuDiv = document.createElement("div");
        menuDiv.classList.add("userMenu");
        menuDiv.innerHTML = `
            <button id="reviewsBtn">My reviews</button>
            <button id="myOrderBtn">My orders</button>
            <button id="changeBtn">Change Info</button>
            <button id="logOutBtn">Log out</button>
            <button id="deleteUserBtn">Delete account</button>
        `;
        this.shadow.appendChild(menuDiv);
    }

    //-----------------------------------------------------------------------
    userInfoCard(data) {
        const userDiv = document.createElement("div");
        userDiv.classList.add("userCard");
        userDiv.innerHTML = `
            <div class="userInfo">
                <h2>User Information</h2>
                <p><span>Name: </span>${data.fullname}</p>
                <p><span>Email/username: </span>${data.username}</p>
                <p><span>Adress: </span>${data.street}, ${data.zipcode}, ${data.city}, ${data.country}</p>
                <p><span></span></p>
            </div>

            <div class="userImg-and-rating">
                <img src="${data.img}" alt="user img"/>
                <p>${data.userRating()}</p>
            </div>
        `;
        this.shadow.appendChild(userDiv);
    }

    //-----------------------------------------------------------------------
    userLogOutListener() {
        const logOutBtn = this.shadow.getElementById("logOutBtn");

        logOutBtn.addEventListener('click', evt => {
            localStorage.removeItem("userToken");
            localStorage.removeItem("userid");
            localStorage.removeItem("userInfo");
            localStorage.removeItem("cart");

            const logOutEvt = new CustomEvent("logOut", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(logOutEvt);
        });
    }

    //-----------------------------------------------------------------------
    changeUserListener() {
        const changeBtn = this.shadow.getElementById("changeBtn");

        changeBtn.addEventListener('click', evt => {
            const changeUserEvt = new CustomEvent("goToChangeUser", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(changeUserEvt);
        });
    }

    //-----------------------------------------------------------------------
    reviewsListener() {
        const reviewsBtn = this.shadow.getElementById("reviewsBtn");

        reviewsBtn.addEventListener('click', evt => {
            const reviewUserEvt = new CustomEvent("goToReviewsUser", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(reviewUserEvt);
        });
    }

    //-----------------------------------------------------------------------
    deleteUserListener() {
        const deleteBtn = this.shadow.getElementById("deleteUserBtn");

        deleteBtn.addEventListener('click', evt => {

            localStorage.removeItem("userid");
            localStorage.removeItem("userInfo");
            localStorage.removeItem("cart");

            const deleteUserEvt = new CustomEvent("deleteMeUser", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(deleteUserEvt);
        });
    }

    //-----------------------------------------------------------------------
    orderListener() {
        const orderBtn = this.shadow.getElementById("myOrderBtn");

        orderBtn.addEventListener('click', evt => {
            const orderUserEvt = new CustomEvent("goToOrderUser", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(orderUserEvt);
        });
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
customElements.define("user-settings", UserSettingView)
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

        .userMenu {
            display: flex;
            background-color: rgb(205, 139, 118);
            margin: 10px;
            padding: 20px;
            justify-content: space-evenly;
        }

        #changeBtn, #logOutBtn, #deleteUserBtn, #myOrderBtn, #reviewsBtn {
            border: none;
            border-radius: 10px;
            background: rgb(82, 43, 41);
            color: white;
            padding: 10px;
            transition: 0.3s;
        }

        #changeBtn:hover , #logOutBtn:hover , #deleteUserBtn:hover , #myOrderBtn:hover , #reviewsBtn:hover {
            cursor: pointer;
            background: rgba(126, 71, 68, 1);
            box-shadow: 0px 0px 10px 0px rgba(2, 2, 2, 1) inset;
        }

        span {
            font-weight: bold;
        }

        .userCard {
            margin: 10px;
            display: flex;
            justify-content: space-between;
        }

        .userInfo {
            display: flex;
            flex-direction: column;
            gap: 5px;
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
    </style>
`;



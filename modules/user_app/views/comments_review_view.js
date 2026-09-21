import { convertDate } from "../../utils.js";
import { CONFIG } from "../../config.js";

//-----------------------------------------------------------------------
export class CommentsAndReviewView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render(data, prodName) {
        this.shadow.innerHTML = style;
        this.headerComponent();
        this.navigationListners();
        this.displayAllReviewCard(data, prodName);
    }

    //-----------------------------------------------------------------------
    displayAllReviewCard(data, prodName) {
        const reviewDiv = document.createElement("div");
        reviewDiv.classList.add("reviews");
        reviewDiv.innerHTML = `
            <h1>Reviews for ${prodName}</h1>
        `;
        this.shadow.appendChild(reviewDiv);

        if (data.length == 0) {
            return this.noReviews();
        }

        for (let item of data) {
            const reviewCard = this.reviewCard(item);
            reviewDiv.appendChild(reviewCard);
        }
    }

    //-----------------------------------------------------------------------
    reviewCard(item) {

        const reviewCard = document.createElement("div");
        reviewCard.classList.add("review-card");
        reviewCard.innerHTML = `
            <p>${convertDate(item.commentDate)}</p>
            <p>Comment: ${item.comment}</p>
            <p>Rating: ${item.productRating()}</p>
        `;

        return reviewCard;
    }

    //-----------------------------------------------------------------------
    noReviews() {
        const reviewDiv = this.shadow.querySelector(".reviews");

        const noReviewDiv = document.createElement("div");
        noReviewDiv.classList.add("noReviews");
        noReviewDiv.innerHTML = `
            <p>This product currently does not have any reviews</p>
        `;
        reviewDiv.appendChild(noReviewDiv);
    }

    //-----------------------------------------------------------------------
    navigationListners() {
        const cartBtn = this.shadow.getElementById("cartBtn");
        const homeBtn = this.shadow.getElementById("goHome");
        const goBackBtn = this.shadow.getElementById("goBackToDetail");

        homeBtn.addEventListener('click', evt => {
            const goHomeEvt = new CustomEvent("goHome", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goHomeEvt);
        });

        cartBtn.addEventListener('click', evt => {
            const cartViewEvt = new CustomEvent("goToCart", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(cartViewEvt);
        });

        goBackBtn.addEventListener('click', evt => {
            const goBackToDetailEvt = new CustomEvent("goBackToDetail", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goBackToDetailEvt);
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
customElements.define("review-view", CommentsAndReviewView);
//-----------------------------------------------------------------------

const headerHTML = `
    <div class="leftNav">
        <button id="goHome">HOME</button>
        <button id="goBackToDetail">Back</button>
    </div>
`;

const style = `
    <style>
        .reviews {
            margin: 10px;
        }

        .reviews h1, p {
            margin: 0;
            margin-bottom: 10px;
        }
    
        .review-card {
            background-color: rgb(205, 139, 118);
            padding: 20px;
            border-radius: 20px;
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

        #goHome, #goBackToDetail {
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

        #login:hover, #create:hover, #cartBtn:hover, #goHome:hover, #goBackToDetail:hover {
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

import { convertDate } from "../../utils.js";

//-----------------------------------------------------------------------
export class ReviewAdminView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render(data, productData, userData) {
        this.shadow.innerHTML = style;
        this.makeHeader();
        this.displayAllCards(data, productData, userData);
        this.navigationListners();
    }

    //-----------------------------------------------------------------------
    displayAllCards(data, productData, userData) {

        const reviewDiv = document.createElement("div");
        reviewDiv.classList.add("reviews");
        this.shadow.appendChild(reviewDiv);

        if (data.length == 0) {
            this.noReviews();
        }

        for (let item of data) {
            const reviewCard = this.reviewCard(item, productData, userData);
            reviewDiv.appendChild(reviewCard);
        }
    }

    noReviews() {
        const reviewDiv = this.shadow.querySelector(".reviews");

        const noReviewDiv = document.createElement("div");
        noReviewDiv.classList.add("no-reviews");
        noReviewDiv.innerHTML = `
            <h2>Currently there is no reviews</h2>
        `;
        reviewDiv.appendChild(noReviewDiv);
    }

    //-----------------------------------------------------------------------
    reviewCard(item, productData, userData) {

        const product = this.findProductData(item, productData);
        const user = this.findUserData(item, userData);

        const reviewCardDiv = document.createElement("div");
        reviewCardDiv.classList.add("review");
        reviewCardDiv.innerHTML = `
            <div class="content">

                <div class="text">
                    <div class="userInfo">
                        <h2>Reviewed by: ${user.fullname}</h2>
                        <h2>Date: ${convertDate(item.commentDate)}</h2>
                    </div>

                    <div class="product">
                        <p><span>Product: </span>${product.prodName}</p>
                        <p><span>Review comment: </span>${item.comment}</p>
                        <p><span>Review rating: </span>${item.productRating()}</p>
                    </div>
                </div>

                <button id="deleteBtn">DELETE</button>
            </div>
            <hr>     
        `;

        const deleteBtn = reviewCardDiv.querySelector("#deleteBtn");

        deleteBtn.addEventListener('click', evt => {
            const getorderIdEvt = new CustomEvent("deleteReviewAdmin", { composed: true, bubbles: true, detail: item.commentId });
            this.shadow.dispatchEvent(getorderIdEvt);
            reviewCardDiv.remove();
        });

        return reviewCardDiv;
    }

    //-----------------------------------------------------------------------
    findProductData(item, productData) {
        const productId = item.productId;
        for (let product of productData) {
            if (product.prodId == productId) {
                return product;
            }
        }
    }

    //-----------------------------------------------------------------------
    findUserData(item, userData) {
        const userId = item.userId;
        for (let user of userData) {
            if (user.userId == userId) {
                return user;
            }
        }
    }

    //-----------------------------------------------------------------------
    navigationListners() {
        const goBackBtn = this.shadow.getElementById("goBack");
        const homeBtn = this.shadow.getElementById("goHome");

        homeBtn.addEventListener('click', evt => {
            const goHomeEvt = new CustomEvent("goHome", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goHomeEvt);
        });

        goBackBtn.addEventListener('click', evt => {
            const goHomeEvt = new CustomEvent("goBackToCommentsAndReview", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goHomeEvt);
        });
    }

    //-----------------------------------------------------------------------
    makeHeader() {
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("header");
        headerDiv.innerHTML = `
            <h1>All reviews</h1>
            <div class="headerButtons">
                <button id="goHome">HOME</button>
                <button id="goBack">go back</button>
            </div>
        `;
        this.shadow.appendChild(headerDiv);
    }
}

//-----------------------------------------------------------------------
customElements.define("review-view-admin", ReviewAdminView);
//-----------------------------------------------------------------------

const style = `
    <style>
        span {
            font-weight: bold;
        }

        h2, p {
            margin: 0;
        }

        .userInfo {
            display: flex;
            flex-direction: column;
        }

        .product {
            margin-top: 10px;
        }

        .content {
            margin: 10px;
            display: flex;
        }

        .header {
            color: rgb(233, 233, 233);
            background-color: rgba(15, 15, 15, 1);
            padding: 10px;         
        }

        .text {
            flex: 1;
        }

        .no-reviews {
            margin: 10px;
        }

        #deleteBtn {
            align-self: center;
            border: none;
            border-radius: 5px;
            background: rgba(255, 66, 66, 1);
            transition: 0.3s;
            padding: 10px; 
            font-weight: bold;
        }

        #deleteBtn:hover {
            cursor: pointer;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 1) inset;
        }

        #goHome, #goBack {
            border: none;
            border-radius: 5px;
            height: 40px;
            width: 100px;
            padding: 10px; 
            color: black;
            background: rgba(46, 228, 107, 1);
            transition: 0.3s;
        }

        #goHome:hover, #goBack:hover {
            cursor: pointer;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 1) inset; 
        }
    </style>
`;
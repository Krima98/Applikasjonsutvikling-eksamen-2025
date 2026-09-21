import { CONFIG } from "../../config";

export class ReviewDeleteView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render(data, productData) {
        this.shadow.innerHTML = style;
        this.headerComponent();
        this.navigationListners();
        this.displayAllReviews(data, productData);
    }

    //-----------------------------------------------------------------------
    displayAllReviews(data, productData) {
        const reviewDiv = document.createElement("div");
        reviewDiv.classList.add("reviews");
        this.shadow.appendChild(reviewDiv);

        if (data.length === 0) {
            return this.noReviews();
        }

        for (let review of data) {
            const reviewCard = this.reviewCard(review, productData);
            reviewDiv.append(reviewCard);
        }
    }

    //-----------------------------------------------------------------------
    noReviews() {
        const reviewDiv = this.shadow.querySelector(".reviews");

        const noReviewDiv = document.createElement("div");
        noReviewDiv.classList.add("no-review");
        noReviewDiv.innerHTML = `
            <h2>No Reviews</h2>
        `;
        reviewDiv.appendChild(noReviewDiv);
    }

    //-----------------------------------------------------------------------
    reviewCard(review, productData) {
        const product = this.findProductData(review, productData);

        const reviewCard = document.createElement("div");
        reviewCard.classList.add("review");
        reviewCard.innerHTML = `
            <div class="info">

                <div class="review-comment">
                    <h2>${product.prodName}</h2>
                    <p><span>Review comment:</span> ${review.comment}</p>
                    <p><span>Product rating:</span> ${review.productRating()}</p>
                </div>

                <button id="deleteBtn">DELETE</button>
            </div>
            <hr>
        `;

        const deleteBtn = reviewCard.querySelector("#deleteBtn");

        deleteBtn.addEventListener('click', evt => {
            const deleteReviewEvt = new CustomEvent("deleteReviewUser", { composed: true, bubbles: true, detail: review.commentId });
            this.shadow.dispatchEvent(deleteReviewEvt);
            reviewCard.remove();
        });

        return reviewCard;
    }

    //-----------------------------------------------------------------------
    findProductData(data, productData) {
        const productId = data.productId;
        for (let product of productData) {
            if (product.prodId == productId) {
                return product;
            }
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
            const userId = localStorage.getItem("userid");
            const userSettingEvt = new CustomEvent("goToUserSettings", { composed: true, bubbles: true, detail: userId });
            this.shadow.dispatchEvent(userSettingEvt);
        });

        return headerDiv;
    }
}

//-----------------------------------------------------------------------
customElements.define("delete-reviews-view", ReviewDeleteView);
//-----------------------------------------------------------------------

const headerHTML = `
    <div class="leftNav">
        <button id="goHome">HOME</button>

        <button id="goBackBtn">Back</button>
    </div>
`;

//--------------------------------------------------------------
const style = `
    <style>
        * {
            margin: 0;
        }

        span {
            font-weight: bold;
        }

        hr {
            margin: 0;
            border: none;     
            height: 1px;        
            background: rgb(51, 38, 29);             
        }

        p {
            line-height: 1.5;
        }

        .no-review {
            margin: 10px;
        }

        .info {
            display: flex;
            justify-content: space-between;
            margin: 10px;
        }

        #deleteBtn {
            min-width: 100px;
            align-self: center;
            color: black;
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
import { showMessage } from "../../msg_handler.js";
import { errorHandler } from "../../error_handler.js";
import { CONFIG } from "../../config.js";

//-----------------------------------------------------------------------
export class DetailView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render(data) {
        this.shadow.innerHTML = style;
        this.headerComponent();
        this.navigationListners();
        this.detailCard(data);
        this.checkDescription(data);
        this.checkDiscount(data);
        this.toCartListener(data);
        this.commentAndReviewForm(data);
    }

    //-----------------------------------------------------------------------
    detailCard(data) {

        const detailCardDiv = document.createElement("div");
        detailCardDiv.classList.add("product");
        detailCardDiv.innerHTML = `
            <div class="info-container">
                <div class="img-container">
                    <h1 id="discTxt">${data.prodDisc}% off!</h1>
                    <img src="${data.checkImg()}" alt="product-big-img">
                </div>
        
                <div class="info-product">
                    <div class="title-info">
                        <h3>${data.prodName}</h3>
                        <hr>
                        <p>${data.prodHeading}</p>
                        <p><span>Price:</span> ${data.checkDiscount()}</p>
                        <p><span>Stock:</span> ${data.checkStock()}</p>
                        <p><span>Rating:</span> ${data.checkRating()}</p>
                    </div>

                    <div class="add-to-cart">
                        <button id="reviewBtn">Check reviews</button>
                        <button id="addBtn">Buy this item</button>
                    </div>
                </div>
            </div>
                
            <div id="about-product">
                <div class="productDescription">
                    <h3>About this product</h3>
                    <p>${data.prodDescr}</p>
                </div>

                <div class="nutrition">
                    <h3>contains</h3>
                    <p>fat: ${data.prodFat}</p>
                    <hr>
                    <p>carbs: ${data.prodCarb}</p>
                    <hr>
                    <p>protein: ${data.prodProtein}</p>
                    <hr>
                    <p>energy: ${data.prodEnergy}</p>
                </div>
            </div>
        `;
        this.shadow.appendChild(detailCardDiv);

        const checkReviewBtn = this.shadow.getElementById("reviewBtn");

        checkReviewBtn.addEventListener('click', evt => {
            const goReviewView = new CustomEvent("goReviewView", { composed: true, bubbles: true, detail: data.prodId });
            goReviewView.productName = data.prodName;
            this.shadow.dispatchEvent(goReviewView);
        })
    }

    //-----------------------------------------------------------------------
    checkDescription(data) {
        let description = data.prodDescr;
        let aboutDiv = this.shadow.getElementById("about-product");

        if (!description) {
            aboutDiv.remove();
        }
    }

    //-----------------------------------------------------------------------
    checkDiscount(data) {
        const discount = data.prodDisc;
        const discountTxt = this.shadow.getElementById("discTxt");

        if (discount == 0) {
            discountTxt.remove();
        }
    }

    //-----------------------------------------------------------------------
    commentAndReviewForm(data) {
        if (localStorage.getItem("userToken")) {
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("review-form");
            commentDiv.innerHTML = `
                <textarea id="userInput" name="comment_text" placeholder="type in a review here"></textarea>
                <select id="userRating" name="userRating">
                    <option value="">Rating</option>
                    <option value="1">⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="5">⭐⭐⭐⭐⭐</option>
                </select>
                <button id="sendReviewBtn">send review</button>
            `;
            this.shadow.appendChild(commentDiv);
            this.sendReview(data);
        }
    }

    //-----------------------------------------------------------------------
    sendReview(data) {
        const sendBtn = this.shadow.getElementById("sendReviewBtn");
        const rating = this.shadow.getElementById("userRating");
        const comment = this.shadow.getElementById("userInput");

        sendBtn.addEventListener('click', evt => {

            const reviewForm = {
                product_id: data.prodId,
                comment_text: comment.value,
                rating: rating.value,
            };

            const sendReview = new CustomEvent("sendReview", { composed: true, bubbles: true });
            sendReview.reviewForm = reviewForm;
            this.shadow.dispatchEvent(sendReview);
        });
    }

    //-----------------------------------------------------------------------
    toCartListener(data) {
        const addBtn = this.shadow.getElementById("addBtn");
        let theList = localStorage.getItem("cart");
        let cartList = theList ? JSON.parse(theList) : [];

        const product = {
            name: data.prodName,
            prodNum: data.prodNumbId,
            price: data.prodPrice == data.discountPrice ? data.prodPrice : Math.floor(data.discountPrice),
            quantity: 1,
            stock: data.checkStock(),
            estShip: data.prodShipDate
        };

        addBtn.addEventListener('click', evt => {
            const checkExsist = cartList.some(item => item.prodNum === product.prodNum);

            if (!checkExsist) {
                cartList.push(product);
                localStorage.setItem("cart", JSON.stringify(cartList));
                showMessage(`You have added ${product.name} to your cart`);
            } else {
                return errorHandler(`you allready have ${product.name} in cart, change quantity in checkout`);
            }
        });
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
            const goBackToListEvt = new CustomEvent("goBackToProductList", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goBackToListEvt);
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
            const userId = localStorage.getItem("userid");
            const userSettingEvt = new CustomEvent("goToUserSettings", { composed: true, bubbles: true, detail: userId });
            this.shadow.dispatchEvent(userSettingEvt);
        });

        return headerDiv;
    }
}

//-----------------------------------------------------------------------
customElements.define("detail-product-view", DetailView);
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

        .product {
            padding: 10px;
            margin: 10px;
            background-color: rgb(205, 139, 118);
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .img-container {
            position: relative;
        }

        .info-container {
            display: flex;
            gap: 20px;
        }

        .img-container img {
            border-radius: 10px;
        }

        .img-container h1 {
            position: absolute;
            top: 0;
            left: 0;
            background-color: rgba(255, 0, 0, 0.6);
            border-radius: 10px 0px 10px 0px;
            padding: 10px;
        }

        .info-product {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .title-info {
            line-height: 1.5;
        }
        
        #about-product {
            display: flex;
            line-height: 1.5;
            gap: 30px;
        }

        .productDescription {
            flex: 2;
        }

        .nutrition {
            flex: 1;
        }

        #reviewBtn, #addBtn {
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px;
            background: rgb(82, 43, 41);
            transition: 0.3s;
        }

        #reviewBtn:hover, #addBtn:hover {
            cursor: pointer;
            background: rgba(126, 71, 68, 1);
            box-shadow: 0px 0px 10px 0px rgba(2, 2, 2, 1) inset;
        }

        .review-form {
            background-color: rgb(205, 139, 118);
            display: flex;
            flex-direction: column;
            padding: 10px;
            margin: 10px;
            border-radius: 20px;
            gap: 10px;
        }

        textarea {
            height: 80px;
            resize: none;
            border-radius: 10px;
            padding: 5px;
            font-family: Arial, Helvetica, sans-serif;
        }

        textarea:hover, select:hover {
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }

        textarea:focus, select:focus {
            outline: none;
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }

        select {
            padding: 12px;
            border: none;
            border-radius: 4px;
            box-sizing: border-box;
        }

        #sendReviewBtn {
            width: 100px;
            align-self: center;
            color: white;
            border: none;
            border-radius: 5px;
            background: rgb(82, 43, 41);
            transition: 0.3s;
            padding: 10px;
        }

        #sendReviewBtn:hover {
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

        #goHome, #goBackBtn {
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px;
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

        .add-to-cart {
            display: flex;
            gap: 10px;
        }

        @media (max-width: 600px) {
            .info-container {
            flex-wrap: wrap;
            gap: 20px;
            }

            .img {
                width: 100%

            }

            .info-product {
                gap: 30px;
            }
        }
    </style>
`;
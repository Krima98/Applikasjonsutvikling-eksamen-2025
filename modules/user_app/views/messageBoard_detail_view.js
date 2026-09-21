import { errorHandler } from "../../error_handler.js";
import { convertDate, sanitizeString } from "../../utils.js";
import { CONFIG } from "../../config.js";

//-----------------------------------------------------------------------
export class DetailMessageBoardView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render(data, userData) {

        this.shadow.innerHTML = style;
        this.headerComponent();
        this.navigationListners();
        if (data.length == 1) {
            this.displayMainPost(data);
            this.commentPostForm(data);
        } else {
            this.displayMainPost(data);
            this.displayComments(data, userData);
            this.commentPostForm(data);
        }
    }

    //-----------------------------------------------------------------------
    displayMainPost(data) {
        const filterMainPost = data.filter(item => item.prodThredStart === true);

        for (let item of filterMainPost) {
            const mainPost = this.mainPostCard(item);
            this.shadow.appendChild(mainPost);
        }
    }

    //-----------------------------------------------------------------------
    displayComments(data, userData) {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comments");
        this.shadow.appendChild(commentDiv);

        const filterComments = data.filter(item => item.prodThredStart === false);

        for (let item of filterComments) {
            const comment = this.commentCard(item, userData);
            commentDiv.appendChild(comment);
        }
    }

    //-----------------------------------------------------------------------
    mainPostCard(data) {
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");
        postDiv.innerHTML = `
            <h1>${data.heading}</h1>
            <p>${data.postMsg}</p>
        `;
        return postDiv;
    }

    //-----------------------------------------------------------------------
    commentCard(data, userData) {
        const user = this.findUserData(data, userData);

        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");
        commentDiv.innerHTML = `
            <div class="imgDiv">
                <img src="${user.img}" id="commentImg">
            </div>
            <div class="comment-info">
                <div class="header-info-comment">
                    <p>${user.fullname}</p>
                    <p>${convertDate(data.date)}</p>
                </div>
                <hr>
                <div class="commentText">
                <p>${data.postMsg}</p> 
                </div>           
            </div>
        `;

        const appendDiv = commentDiv.querySelector(".commentText");
        this.imgListener(commentDiv, data, user);

        if (user.userId == localStorage.getItem("userid")) {
            const deleteBnt = this.makeDeleteBtn(commentDiv, data);
            appendDiv.appendChild(deleteBnt);
        }

        return commentDiv;
    }

    //-----------------------------------------------------------------------
    makeDeleteBtn(selectedDiv, data) {
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "DELETE";
        deleteBtn.id = "deleteBtn";

        deleteBtn.addEventListener('click', evt => {
            const deleteCommentPostEvt = new CustomEvent("deleteCommentPost", { composed: true, bubbles: true, detail: data.postId });
            this.shadow.dispatchEvent(deleteCommentPostEvt);
            selectedDiv.remove();
        });

        return deleteBtn;
    }

    //-----------------------------------------------------------------------
    imgListener(selectedDiv, data, user) {
        const imgBtn = selectedDiv.querySelector("#commentImg");

        imgBtn.addEventListener('click', evt => {
            if (user.userId == localStorage.getItem("userid")) {
                return errorHandler("Can't rate yourself");
            }
            this.dialogRateUser(user, data);
        });
    }

    //-----------------------------------------------------------------------
    dialogRateUser(user, data) {
        const dialog = document.createElement("dialog");
        dialog.id = "rateCard";
        dialog.innerHTML = dialogStyle + `
            <button id="closeBtn">close</button>

            <div class="rate-header">
                <h2>RATE USER</h2>
            </div>
           
            <div class="rateCard">

                <div class="rate-user-info">
                    <p>${user.fullname}</p>
                    <img src="${user.img}">
                    <p>${user.userRating()}</p>
                </div>

                <div class="rateBox">
                    <div class="rate-select">
                        <select id="rateUserInput" name="beenz">
                            <option value="">Rating</option>
                            <option value="1">⭐</option>
                            <option value="2">⭐⭐</option>
                            <option value="3">⭐⭐⭐</option>
                            <option value="4">⭐⭐⭐⭐</option>
                            <option value="5">⭐⭐⭐⭐⭐</option>
                        </select>

                        <button id="rateBtn">Rate</button>                       
                    </div>
                </div>
            </div>
        `;
        this.shadow.appendChild(dialog);
        dialog.showModal();
        this.dialogListeners(data, user);
    }

    //-----------------------------------------------------------------------
    dialogListeners(data, user) {
        const dialog = this.shadow.getElementById("rateCard");
        this.shadow.getElementById("closeBtn");

        const closeBtn = this.shadow.getElementById("closeBtn");
        closeBtn.addEventListener('click', evt => {
            dialog.remove();
        })

        this.sendRating(user, data);
    }

    //-----------------------------------------------------------------------
    sendRating(user, data) {
        const rateBtn = this.shadow.getElementById("rateBtn");
        const rating = this.shadow.getElementById("rateUserInput");

        rateBtn.addEventListener('click', evt => {

            if (!rating.value) {
                return errorHandler("Need to select rating!");
            }

            const ratingFrom = {
                userid: user.userId,
                beenz: rating.value,
            };

            const sendReview = new CustomEvent("rateUserBeenz", { composed: true, bubbles: true, detail: data.threadId });
            sendReview.reviewForm = ratingFrom;
            this.shadow.dispatchEvent(sendReview);
        });
    }

    //-----------------------------------------------------------------------
    commentPostForm(data) {
        const postFormDiv = document.createElement("div");
        postFormDiv.classList.add("commentForm");
        postFormDiv.innerHTML = `
            <textarea id="userInputTxt" name="message_text" placeholder="message text"></textarea>
            <button id="commentBtn">Comment</button>
        `;
        this.shadow.appendChild(postFormDiv);
        this.sendComment(data);
    }

    //-----------------------------------------------------------------------
    sendComment(data) {
        const commentBtn = this.shadow.getElementById("commentBtn");
        const messageTxt = this.shadow.getElementById("userInputTxt");
        const mainPost = data[0];

        commentBtn.addEventListener('click', evt => {
            const commentForm = {
                heading: `reply on ${mainPost.heading}`,
                message_text: sanitizeString(messageTxt.value),
            };

            if (!messageTxt.value) {
                return errorHandler("You need to write a comment first.");
            }

            const sendComment = new CustomEvent("commentPost", { composed: true, bubbles: true, detail: mainPost.threadId });
            sendComment.commentForm = commentForm;
            this.shadow.dispatchEvent(sendComment);
        });
    }

    //-----------------------------------------------------------------------
    findUserData(data, userData) {
        const userId = data.userId;
        for (let user of userData) {
            if (user.userId == userId) {
                return user;
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
            const goBackToListEvt = new CustomEvent("goBackToMessage", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goBackToListEvt);
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
customElements.define("detail-message-view", DetailMessageBoardView);
//-----------------------------------------------------------------------
const headerHTML = `
    <div class="leftNav">
        <button id="goHome">HOME</button>

        <button id="goBackBtn">Back</button>
    </div>
`;

//-----------------------------------------------------------------------
const dialogStyle = `
    <style> 
        dialog {
            display: flex;
            flex-direction: column;
            border: none;
            border-radius: 20px;
            padding: 10px;
            width: 300px;
            position: fixed;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgb(205, 139, 118);
            box-shadow: 0px 0px 30px 0px rgba(2, 2, 2, 1);
        }
        
        .rateCard {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }

        .rate-header {
            text-align: center;
        }

        #closeBtn {
            align-self: flex-end; 
            text-align: center;
            border: none;
            border-radius: 5px;
            color: white;
            padding: 10px;
            background: rgba(163, 8, 0, 1);
            transition: 0.3s;
        }

        #closeBtn:hover {
            cursor: pointer;
            box-shadow: 0px 0px 10px 0px rgba(2, 2, 2, 1) inset;
        }

        .rateBox {
            display: flex;
            flex-direction: column;
            gap: 10px;
            justify-content: center;
        }

        .rate-user-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
        }

        .rate-select {
            display: flex;
            flex-direction: column;
            justify-self: center;
            gap: 5px;
            width: 150px;
        }

        select {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 4px;
            box-sizing: border-box;
            flex: 3;
        }

        select:hover {
            cursor: pointer;
        }

        select:focus {
            outline: none;
        }

        select:hover {
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }

        #rateBtn {
            width: 100px;
            align-self: center;
            color: white;
            border: none;
            border-radius: 5px;
            background: rgb(82, 43, 41);
            transition: 0.3s;
            padding: 10px;
        }

        #rateBtn:hover {
            cursor: pointer;
            background: rgba(126, 71, 68, 1);
            box-shadow: 0px 0px 10px 0px rgba(2, 2, 2, 1) inset;
        }
    </style>
`;
//-----------------------------------------------------------------------
const style = `
    <style>
        * {
            margin: 0;
        }

        #commentImg {
            border-radius: 10px;
            heigt: 70px;
            width: 70px;
            transition: 0.2s;
        }

        #commentImg:hover {
            cursor: pointer;
            scale: 1.05;
        }

        .post {
            background-color: rgb(205, 139, 118);
            border-radius: 20px;
            margin: 10px;
            padding: 10px;
        }

        .comments {
            background-color: rgb(205, 139, 118);
            display: flex;
            flex-direction: column;
            gap: 10px;
            border-radius: 20px;
            padding: 10px;
            margin: 10px;
        }

        .comment {
            display: flex;
            border-radius: 20px;
            padding: 10px;
            gap: 10px;
            background-color: rgba(0, 0, 0, 0.25);
        }

        .comment-info {
            width: 100%;
        }

        .commentText {
            display: flex;
        }

        #deleteBtn {
            margin-left: auto;
            margin-top: 5px;
            align-self: flex-start;
            border: none;
            border-radius: 5px;
            color: white;
            padding: 10px;
            background: rgba(163, 8, 0, 1);
            transition: 0.3s;
        }

        #deleteBtn:hover {
            cursor: pointer;
            box-shadow: 0px 0px 10px 0px rgba(2, 2, 2, 1) inset;
        }

        .header-info-comment {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }

        .commentForm {
            background-color: rgb(205, 139, 118);
            padding: 10px;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin: 10px 10px; 
        }

        textarea {
            height: 80px;
            resize: none;
            border-radius: 10px;
            padding: 5px;
            font-family: "ebrima";
        }
        
        textarea:hover {
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }

        textarea:focus {
            outline: none;
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }

        #commentBtn {
            width: 100px;
            align-self: center;
            color: white;
            border: none;
            border-radius: 5px;
            background: rgb(82, 43, 41);
            transition: 0.3s;
            padding: 10px;
        }

        #commentBtn:hover {
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

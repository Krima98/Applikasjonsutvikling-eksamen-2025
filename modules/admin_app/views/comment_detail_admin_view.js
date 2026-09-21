import { convertDate } from "../../utils.js";

export class CommentDetailAdminView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    render(data, userData) {
        this.shadow.innerHTML = style;
        this.makeHeader();
        this.displayMainPost(data);
        this.displayComments(data, userData);
        this.navigationListners();
        this.deleteMainPostListener(data);
    }

    //--------------------------------------------------------------
    makeHeader() {
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("header");
        headerDiv.innerHTML = `
            <h1>Detail post</h1>
            <div class="headerButtons">
            
                <div class="navButtons">
                    <button id="goHome">HOME</button>
                    <button id="goBack">go back</button>
                </div>

                <div class="detailButtons">
                    <button id="deletePostBtn">DELETE POST</button>
                </div>

            </div>
        `;
        this.shadow.appendChild(headerDiv);
    }

    //--------------------------------------------------------------
    displayMainPost(data) {
        const filterMainPost = data.filter(item => item.prodThredStart === true);

        for (let item of filterMainPost) {
            const mainPost = this.mainPostCard(item);
            this.shadow.appendChild(mainPost);
        }
    }

    //--------------------------------------------------------------
    mainPostCard(item) {
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");
        postDiv.innerHTML = `
            <h1>${item.heading}</h1>
            <p>${item.postMsg}</p>
        `;
        return postDiv;
    }

    //--------------------------------------------------------------
    displayComments(data, userData) {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comments");
        this.shadow.appendChild(commentDiv);

        const filterComments = data.filter(item => item.prodThredStart === false);

        if (filterComments.length == 0) {
            this.noComments();
        }

        for (let data of filterComments) {
            const comment = this.commentCard(data, userData);
            commentDiv.appendChild(comment);
        }
    }

    //--------------------------------------------------------------
    noComments() {
        const commentDiv = this.shadow.querySelector(".comments");

        const noCommentDiv = document.createElement("div");
        noCommentDiv.classList.add("no-comments");
        noCommentDiv.innerHTML = `
            <p>Currently no comments on this post</p>
        `;
        commentDiv.appendChild(noCommentDiv);
    }

    //--------------------------------------------------------------
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
                    <button id="deleteBtn">DELETE</button>
                </div>
                            
            </div>
        `;

        const deleteBtn = commentDiv.querySelector("#deleteBtn");

        deleteBtn.addEventListener('click', evt => {
            const deleteCommentEvt = new CustomEvent("deleteComment", { composed: true, bubbles: true, detail: data.postId });
            this.shadow.dispatchEvent(deleteCommentEvt);
            commentDiv.remove();
        });

        return commentDiv;
    }

    //--------------------------------------------------------------
    deleteMainPostListener(data) {
        const deleteMainBtn = this.shadow.getElementById("deletePostBtn");
        const mainPost = data[0];

        deleteMainBtn.addEventListener('click', evt => {
            const deleteMainPostEvt = new CustomEvent("deleteMainPost", { composed: true, bubbles: true, detail: mainPost.postId });
            this.shadow.dispatchEvent(deleteMainPostEvt);
        });
    }

    //--------------------------------------------------------------
    findUserData(data, userData) {
        const userId = data.userId;
        for (let user of userData) {
            if (user.userId == userId) {
                return user;
            }
        }
    }

    //--------------------------------------------------------------
    navigationListners() {
        const homeBtn = this.shadow.getElementById("goHome");
        const goBackBtn = this.shadow.getElementById("goBack");

        homeBtn.addEventListener('click', evt => {
            const goHomeEvt = new CustomEvent("goHome", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goHomeEvt);
        });

        goBackBtn.addEventListener('click', evt => {
            const goHomeEvt = new CustomEvent("goBackToAllPost", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goHomeEvt);
        });
    }
}

//--------------------------------------------------------------
customElements.define("detail-post-view", CommentDetailAdminView);
//--------------------------------------------------------------

const style = `
    <style>
        .post {
            border: solid black 2px;
            margin: 10px;
            padding: 10px;
        }

        hr {
            border: none;
            height: 1px;
            background: rgba(0, 0, 0, 1);
        }

        p, .post h1 {
            margin: 0;
        }

        #commentImg {
            border-radius: 10px;
            heigt: 70px;
            width: 70px;
        }

        .comments {
            margin: 0;
            border: solid black 2px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 10px;
            margin: 10px;
        }

        .comment {
            display: flex;
            padding: 10px;
            gap: 10px;
            background-color: rgba(0, 0, 0, 0.25);
            
        }

        .comment-info {
            width: 100%;
        }

        .header-info-comment {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }

        .commentText {
            display: flex;
        }

        #deleteBtn {
            margin-left: auto;
            align-self: flex-start;
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
            color: rgb(233, 233, 233);
            background-color: rgba(15, 15, 15, 1);
            padding: 10px;         
        }

        .headerButtons {
            display: flex;
            justify-content: space-between;
        }

        #goHome, #goBack, #deletePostBtn {
            border: none;
            border-radius: 5px;
            height: 40px;
            min-width: 100px;
            max-width: 150px;
            padding: 10px; 
            color: black;
            background: rgba(46, 228, 107, 1);
            transition: 0.3s;
        }

        #deletePostBtn:hover {
            cursor: pointer;
            background-color: rgba(220, 28, 28, 1);
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 1) inset; 
        }

        #goHome:hover, #goBack:hover {
            cursor: pointer;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 1) inset; 
        }

        #deleteBtn:hover {
            cursor: pointer;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 1) inset;
        }
    </style>
`;
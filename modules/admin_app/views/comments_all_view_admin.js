export class CommentsViewAdmin extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //--------------------------------------------------------------
    render(data) {
        this.shadow.innerHTML = style;
        this.makeHeader();
        this.displayAllPost(data);
        this.navigationListners();
    }

    //--------------------------------------------------------------
    makeHeader() {
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("header");
        headerDiv.innerHTML = `
            <h1>All main posts</h1>
            <div class="headerButtons">
                <button id="goHome">HOME</button>
                <button id="goBack">go back</button>
            </div>
        `;
        this.shadow.appendChild(headerDiv);
    }

    //--------------------------------------------------------------
    displayAllPost(data) {
        const filterMainPost = data.filter(item => item.prodThredStart === true);

        const allPostDiv = document.createElement("div");
        allPostDiv.classList.add("all-Main-post");
        this.shadow.appendChild(allPostDiv);

        if (filterMainPost.length == 0) {
            this.noMainPost();
        }

        for (let item of filterMainPost) {

            const mainPost = this.postCard(item);
            allPostDiv.appendChild(mainPost);

            mainPost.addEventListener('click', evt => {
                const goDetailCommentEvt = new CustomEvent("goDetailCommentView", { composed: true, bubbles: true, detail: item.threadId });
                this.shadow.dispatchEvent(goDetailCommentEvt);
            });
        }
    }

    //--------------------------------------------------------------
    noMainPost() {
        const allPostDiv = this.shadow.querySelector(".all-Main-post");

        const noMainPostDiv = document.createElement("div");
        noMainPostDiv.classList.add("no-main-post");
        noMainPostDiv.innerHTML = `
            <h2>Currently no main posts</h2>
        `;
        allPostDiv.appendChild(noMainPostDiv);
    }

    //--------------------------------------------------------------
    postCard(item) {
        const postCard = document.createElement("div");
        postCard.classList.add("mainPost");
        postCard.innerHTML = `
            <div class="infoPost">
                <h2>${item.heading}</h2>
            </div>
            <hr>
        `;
        return postCard;
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
            const goHomeEvt = new CustomEvent("goBackToCommentsAndReview", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goHomeEvt);
        });
    }
}

//--------------------------------------------------------------
customElements.define("comments-view-admin", CommentsViewAdmin);
//--------------------------------------------------------------

const style = `
    <style>
        .mainPost {
            transition: 0.5s;
        }

        .mainPost:hover {
            cursor: pointer;
            background-color: rgba(46, 228, 107, 1);
        }

        .infoPost {
            display: flex;
            justify-content: space-between;
            padding: 10px;
        }

        .no-main-post h2 {
            margin: 0;
        }

        .no-main-post {
            margin: 10px
        }

        .header {
            color: rgb(233, 233, 233);
            background-color: rgba(15, 15, 15, 1);
            padding: 10px;         
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

        hr {
            margin: 0;
            border: none;
            height: 1px;
            background: rgba(0, 0, 0, 1);
        }
    </style>
`;
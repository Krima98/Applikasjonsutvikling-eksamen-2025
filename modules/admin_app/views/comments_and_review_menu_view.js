export class CommentsAndReviewMenuView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render() {
        this.shadow.innerHTML = style;
        this.makeHeader();
        this.makeMenu();
        this.navigationListener();
    }

    //-----------------------------------------------------------------------
    makeHeader() {
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("header");
        headerDiv.innerHTML = `
            <h1>Comments and Review</h1>
            <div class="headerButtons">
                <button id="goHome">HOME</button>
            </div>
        `;
        this.shadow.appendChild(headerDiv);
    }

    //-----------------------------------------------------------------------
    makeMenu() {
        const menuDiv = document.createElement("div");
        menuDiv.classList.add("menu");
        this.shadow.appendChild(menuDiv)
        const menuList = ["comments", "reviews"];

        for (let item of menuList) {
            const category = this.categoryCard(item);
            menuDiv.appendChild(category);
        }
    }

    //-----------------------------------------------------------------------
    categoryCard(categoryName) {
        const categoryCard = document.createElement("div");
        categoryCard.classList.add("category");
        categoryCard.innerHTML = `
            <h1 id="${categoryName + "Btn"}">${categoryName}</h1>
            <hr>
        `;

        return categoryCard;
    }

    //-----------------------------------------------------------------------
    navigationListener() {
        const homeBtn = this.shadow.getElementById("goHome");
        const commentBtn = this.shadow.getElementById("commentsBtn");
        const reviewBtn = this.shadow.getElementById("reviewsBtn");

        commentBtn.addEventListener('click', evt => {
            const goToCommentsEvt = new CustomEvent("goToCommentsView", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goToCommentsEvt);
        });

        reviewBtn.addEventListener('click', evt => {
            const goToReviewEvt = new CustomEvent("goReviewView", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goToReviewEvt);
        });

        homeBtn.addEventListener('click', evt => {
            const goHomeEvt = new CustomEvent("goHome", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goHomeEvt);
        });
    }
}

//-----------------------------------------------------------------------
customElements.define("comment-and-review-view", CommentsAndReviewMenuView);
//-----------------------------------------------------------------------

const style = `
    <style>
        .header {
            color: rgb(233, 233, 233);
            background-color: rgba(15, 15, 15, 1);
            padding: 10px;
        }

        .category {
            transition: 0.5s;
        }

        .category:hover {
            cursor: pointer;
            background-color: rgba(46, 228, 107, 1);
        }

        .category h1 {
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

        #goHome {
            border: none;
            border-radius: 5px;
            height: 40px;
            width: 100px;
            padding: 10px; 
            color: black;
            background: rgba(46, 228, 107, 1);
            transition: 0.3s;
        }

        #goHome:hover {
            cursor: pointer;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 1) inset;          
        }
    </style>
`;
import { CONFIG } from "../../config";

export class MessageBoardView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render(data) {
        this.shadow.innerHTML = style;
        this.headerComponent();
        this.makeMenu();
        this.navigationListners();
        this.menuListeners();
        this.listAllPost(data);

    }

    //-----------------------------------------------------------------------
    menuListeners() {
        const postBtn = this.shadow.getElementById("postBtn");
        const yourPostsBtn = this.shadow.getElementById("myMainPostBtn");

        postBtn.addEventListener('click', evt => {
            const goToPostEvt = new CustomEvent("goToMakePost", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goToPostEvt);
        });

        yourPostsBtn.addEventListener('click', evt => {
            const goToMyPostEvt = new CustomEvent("goToYourPosts", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goToMyPostEvt);
        });
    }

    //-----------------------------------------------------------------------
    makeMenu() {

        const menuDiv = document.createElement("div");
        menuDiv.classList.add("messageBoardMenu");
        menuDiv.innerHTML = `
            <button id="postBtn">Make post</button>
            <button id="myMainPostBtn">Your posts</button>
        `;
        this.shadow.appendChild(menuDiv);

    }

    //-----------------------------------------------------------------------
    listAllPost(data) {
        const filterData = data.filter(item => item.prodThredStart === true);
        const postDiv = document.createElement("div");
        postDiv.classList.add("all-posts");
        this.shadow.appendChild(postDiv);

        if (filterData.length == 0) {
            this.noPost();
        }

        for (let item of filterData) {
            const post = this.postCard(item);
            postDiv.append(post);

            post.addEventListener('click', evt => {
                const goToDetailPostEvt = new CustomEvent("goToDetailPost", { composed: true, bubbles: true, detail: item.threadId });
                this.shadow.dispatchEvent(goToDetailPostEvt);
            });
        }
    }

    //-----------------------------------------------------------------------
    postCard(item) {
        let postMsg = item.postMsg;
        const msgWords = postMsg.split(" ");
        let postShort = postMsg;

        if (msgWords.length > 30) {
            postShort = msgWords.slice(0, 30).join(" ") + "...";
        }

        const postDiv = document.createElement("div");
        postDiv.classList.add("post");
        postDiv.innerHTML = `
        <h1>${item.heading}</h1>
        <p>${postShort}</p>
        `;

        return postDiv;
    }

    //-----------------------------------------------------------------------
    noPost() {
        const postDiv = this.shadow.querySelector(".all-posts");

        const noPostDiv = document.createElement("div");
        noPostDiv.classList.add("noPost");
        noPostDiv.innerHTML = `
            <h2>There are currently no posts. Make one!</h2>
        `;

        postDiv.appendChild(noPostDiv);
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
customElements.define("message-view", MessageBoardView)
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

        p {
            line-height:1.5;
        }

        .messageBoardMenu {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
        }

        #postBtn, #myMainPostBtn {
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px;
            font-size: 20px;
            background: rgb(82, 43, 41);
            transition: 0.3s;
        }

        #postBtn:hover, #myMainPostBtn:hover {
            cursor: pointer;
            background: rgba(126, 71, 68, 1);
            box-shadow: 0px 0px 10px 0px rgba(2, 2, 2, 1) inset;
        }

        .all-posts {
            background-color: rgb(205, 139, 118);
            padding: 10px;
            margin: 10px;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .post {
            background-color: rgba(126, 71, 68, 1);
            border-radius: 20px;
            padding: 10px;
            color: white;
            transition: 0.5s;
        }

        .post:hover {
            cursor: pointer;
            background-color: rgba(67, 34, 32, 1);
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

        #profilePic:hover {
            cursor: pointer;
            scale: 1.05;
        }
    </style>
`;
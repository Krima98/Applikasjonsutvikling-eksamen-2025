import { CONFIG } from "../../config";

export class OwnMessagePostDeleteView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render(data) {
        this.shadow.innerHTML = style;
        this.headerComponent();
        this.navigationListners();
        this.listAllPost(data);

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
        }
    }

    //-----------------------------------------------------------------------
    postCard(item) {
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");
        postDiv.innerHTML = `
        <h1>${item.heading}</h1>
        <button id="deletePostBtn">DELETE</button>
        `;

        const deleteBtn = postDiv.querySelector("#deletePostBtn");

        deleteBtn.addEventListener('click', evt => {
            const deleteMainPostEvt = new CustomEvent("deleteMainPost", { composed: true, bubbles: true, detail: item.postId });
            this.shadow.dispatchEvent(deleteMainPostEvt);
            postDiv.remove();
        });

        return postDiv;
    }

    //-----------------------------------------------------------------------
    noPost() {
        const postDiv = this.shadow.querySelector(".all-posts");

        const noPostDiv = document.createElement("div");
        noPostDiv.classList.add("no-post");
        noPostDiv.innerHTML = `
            <h2>Currently you don't have any posts</h2>
        `;
        postDiv.appendChild(noPostDiv);
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
customElements.define("own-message-post-view", OwnMessagePostDeleteView);
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
            display: flex;
            justify-content: space-between;
        }

        #deletePostBtn {
            width: 100px;
            align-self: center;
            color: white;
            border: none;
            border-radius: 5px;
            background: rgba(211, 28, 28, 1);
            transition: 0.3s;
            padding: 10px; 
            font-weight: bold;
        }

        #deletePostBtn:hover {
            cursor: pointer;
            background-color: rgba(220, 28, 28, 1);
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
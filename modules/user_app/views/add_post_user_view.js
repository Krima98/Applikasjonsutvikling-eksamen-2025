import { errorHandler } from "../../error_handler.js";
import { sanitizeString } from "../../utils.js";
import { CONFIG } from "../../config.js";

//-----------------------------------------------------------------------
export class AddPostView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render() {
        this.shadow.innerHTML = style;
        this.headerComponent();
        this.navigationListners();
        this.postForm();
    }

    //-----------------------------------------------------------------------
    postForm() {
        const postFormDiv = document.createElement("div");
        postFormDiv.classList.add("make-new-post");
        postFormDiv.innerHTML = `
            <input id="userInputHeading" type="text" name="heading" placeholder="heading">
            <textarea id="userInputTxt" name="message_text" placeholder="message text"></textarea>
            <button id="makePostBtn">Publish</button>
        `;
        this.shadow.appendChild(postFormDiv);
        this.sendPost();
    }

    //-----------------------------------------------------------------------
    sendPost() {
        const postBtn = this.shadow.getElementById("makePostBtn");
        const headingTxt = this.shadow.getElementById("userInputHeading");
        const messageTxt = this.shadow.getElementById("userInputTxt");

        postBtn.addEventListener('click', evt => {

            const postForm = {
                heading: sanitizeString(headingTxt.value),
                message_text: sanitizeString(messageTxt.value),
            };

            if (!headingTxt.value || !messageTxt.value) {
                return errorHandler("Need to fill the whole form");
            }

            const sendPost = new CustomEvent("makeNewPost", { composed: true, bubbles: true });
            sendPost.postForm = postForm;
            this.shadow.dispatchEvent(sendPost);
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
            const userId = localStorage.getItem("userid");
            const userSettingEvt = new CustomEvent("goToUserSettings", { composed: true, bubbles: true, detail: userId });
            this.shadow.dispatchEvent(userSettingEvt);
        });

        return headerDiv;
    }
}

//-----------------------------------------------------------------------
customElements.define("post-view", AddPostView);

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

        .make-new-post {
            background-color: rgb(205, 139, 118);
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin: 10px;
            padding: 10px;
            border-radius: 20px;
        }

        #makePostBtn {
            width: 100px;
            align-self: center;
            color: white;
            border: none;
            border-radius: 5px;
            background: rgb(82, 43, 41);
            transition: 0.3s;
            padding: 10px;
        }

        #makePostBtn:hover {
            cursor: pointer;
            background: rgba(126, 71, 68, 1);
            box-shadow: 0px 0px 10px 0px rgba(2, 2, 2, 1) inset;
        }

        input[type=text] {
            width: 100%;
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }

        input[type="text"]:focus {
            outline: none;
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }

        input[type="text"]:hover {
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }

        textarea {
            height: 80px;
            resize: none;
            border-radius: 10px;
            padding: 5px;
            font-family: Arial, Helvetica, sans-serif;
        }

        textarea:hover {
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }

        textarea:focus {
            outline: none;
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
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


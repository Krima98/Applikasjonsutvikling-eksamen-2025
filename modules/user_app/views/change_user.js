import { CONFIG } from "../../config.js";
import { errorHandler } from "../../error_handler.js";

//-----------------------------------------------------------------------
export class ChangeUserView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render() {
        this.shadow.innerHTML = style;
        this.headerComponent();
        this.navigationListners();
        this.formData();
    }

    //-----------------------------------------------------------------------
    formData() {
        const fromDiv = document.createElement("div");
        fromDiv.innerHTML = `
            <h1>Change your user information</h1>
            <form id="formData">
                <span>Full Name</span>
                <input name="fullname" type="text" placeholder="Full Name">
                <span>Username</span>
                <input name="username" type="email" placeholder="Username/mail">
                <span>Password</span>
                <input name="password" type="text" placeholder="Password">
                <span>Street</span>
                <input name="street" type="text" placeholder="Street">
                <span>City</span>
                <input name="city" type="text" placeholder="City">
                <span>Zipcode</span>
                <input name="zipcode" type="number" placeholder="Zipcode">
                <span>Country</span>
                <input name="country" type="text" placeholder="Country">
                <span>User profile image</span>
                <input name="img_file" id="imgFile" type="file">
                
                <input type="submit" id="changeUserBtn" value="change info">
            </form>
        `;
        this.shadow.appendChild(fromDiv);
        this.sendFromListener();

    }

    //-----------------------------------------------------------------------
    sendFromListener() {

        const theForm = this.shadow.getElementById("formData");
        const formFile = this.shadow.getElementById("imgFile");

        theForm.addEventListener('submit', evt => {
            evt.preventDefault();

            const file = formFile.files[0];

            if (file && file.size > 1024 * 1024) {
                return errorHandler("File too big. Need to be under 1MB.");
            }

            if (file && (file.type != "image/png" && file.type != "image/jpeg")) {
                return errorHandler("wrong filetype, needs to be PNG or JPEG!");
            }

            const formData = new FormData(theForm);
            formData.set("username", formData.get("username").toLowerCase());

            const userId = localStorage.getItem("userid");
            const changeUserInfoEvt = new CustomEvent("changeUser", { composed: true, bubbles: true, detail: userId });
            changeUserInfoEvt.userForm = formData;
            this.shadow.dispatchEvent(changeUserInfoEvt);
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
            const userId = localStorage.getItem("userid")
            const userSettingEvt = new CustomEvent("goToUserSettings", { composed: true, bubbles: true, detail: userId });
            this.shadow.dispatchEvent(userSettingEvt);
        });

        return headerDiv;
    }
}

//-----------------------------------------------------------------------
customElements.define("change-user-view", ChangeUserView);
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
        h1 {
            padding-left: 30px;
        }

        input[type=text], input[type=number], input[type=email] {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 4px;
            box-sizing: border-box;
            }

        input[type="text"]:focus, input[type=number]:focus, input[type=email]:focus {
            outline: none;
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }

        input[type="text"]:hover, input[type=number]:hover, input[type=email]:hover {
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }

        #formData {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 0px 30px;      
        }

        #changeUserBtn {
            width: 100px;
            align-self: center;
            color: white;
            border: none;
            border-radius: 5px;
            background: rgb(82, 43, 41);
            transition: 0.3s;
            padding: 10px;
        }

        #changeUserBtn:hover {
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
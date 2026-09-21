import { errorHandler } from "../../error_handler.js";
//-----------------------------------------------------------------------

export class CreateUserView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.shadow = this.attachShadow({ mode: "open" });
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
        const formDiv = document.createElement("div");
        formDiv.classList.add("userInformation");
        formDiv.innerHTML = `
            <h2>CREATE USER</h2>
            <form id="formData">
                <span>Username (email)</span>
                <input id="usernameInput" name="username" type="email" placeholder="username (email)" required>
                <span>Password</span>
                <input name="password" type="text" placeholder="password" required>
                <span>Full Name</span>
                <input name="fullname" type="text" placeholder="full name" required>
                <span>Street</span>
                <input name="street" type="text" placeholder="street" required>
                <span>City</span>
                <input name="city"  type="text" placeholder="city" required>
                <span>Zipcode</span>
                <input name="zipcode" type="number" placeholder="zipcode" required>
                <span>Country</span>
                <input name="country" type="text" placeholder="country" required>
                <span>User profile image</span>
                <input name="img_file" id="imgFile" type="file">

                <input type="submit" id="createUserBtn" value="create user">
            </form>
        `;
        this.shadow.appendChild(formDiv);
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

            const createUserEvt = new CustomEvent("addUser", { composed: true, bubbles: true });
            createUserEvt.userForm = formData;
            this.shadow.dispatchEvent(createUserEvt);
        });
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

        const userOff = this.contentUserOff();
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("header");
        headerDiv.innerHTML = headerHTML;
        this.shadow.appendChild(headerDiv);
        headerDiv.appendChild(userOff);
    }

    //-----------------------------------------------------------------------
    contentUserOff() {
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("rightNav");
        headerDiv.innerHTML = `
            <div class="accountButtons">
                <button id="login">log in</button>

            </div>

            <button id="cartBtn">CART</button>
        `;

        const loginBtn = headerDiv.querySelector("#login");

        loginBtn.addEventListener('click', evt => {
            const loginUserEvt = new CustomEvent("goToLoginUser", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(loginUserEvt);
        });
        return headerDiv;
    }
}

//-----------------------------------------------------------------------
customElements.define("create-user", CreateUserView);

//-----------------------------------------------------------------------
const headerHTML = `
    <div class="leftNav">
        <button id="goHome">HOME</button>
    </div>
`;

//-----------------------------------------------------------------------
const style = `
    <style>
       input[type=text], input[type=number], input[type=email] {
            width: 100%;
            padding: 12px;
            border: 1px solid #ccc;
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

        #createUserBtn {
            width: 100px;
            align-self: center;
            color: white;
            border: none;
            border-radius: 5px;
            background: rgb(82, 43, 41);
            transition: 0.3s;
            padding: 10px;
        }

        #createUserBtn:hover {
            cursor: pointer;
            background: rgba(126, 71, 68, 1);
            box-shadow: 0px 0px 10px 0px rgba(2, 2, 2, 1) inset;
        }

        h2 {
            margin-bottom: 0;
            text-align: center;
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

        #login {
            width: 100px;
            height: 50px;
            color: white;
            border: none;
            border-radius: 5px;
            background: rgb(82, 43, 41);
            transition: 0.3s;
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

        #login:hover, #cartBtn:hover, #goHome:hover {
            cursor: pointer;
            background: rgba(126, 71, 68, 1);
            box-shadow: 0px 0px 10px 0px rgba(2, 2, 2, 1) inset;
        }
    </style>
`;
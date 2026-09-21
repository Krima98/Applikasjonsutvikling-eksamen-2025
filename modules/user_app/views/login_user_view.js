export class LoginUserView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render() {
        this.shadow.innerHTML = style;
        this.headerComponent();
        this.navigationListners();
        this.makeLogin();
        this.loginListner();
    }

    //-----------------------------------------------------------------------
    makeLogin() {
        const loginDiv = document.createElement("div");
        loginDiv.classList.add("login")
        loginDiv.innerHTML = `
            <input id="userName" type="text" placeholder="Username" value="">
            <input id="password" type="password" placeholder="Password" value="">
            <button id="loginBtn">Login</button>      
        `;
        this.shadow.appendChild(loginDiv);
    }

    //-----------------------------------------------------------------------
    loginListner() {
        const userNameInput = this.shadow.getElementById("userName");
        const userPasswordInput = this.shadow.getElementById("password");
        const loginBtn = this.shadow.getElementById("loginBtn");

        loginBtn.addEventListener('click', evt => {
            const loginEvt = new CustomEvent("loginUser", {
                composed: true, bubbles: true,
                detail: {
                    username: userNameInput.value.toLowerCase(),
                    password: userPasswordInput.value
                }
            });
            this.shadow.dispatchEvent(loginEvt);
        });
    }

    //-----------------------------------------------------------------------
    navigationListners() {
        const cartBtn = this.shadow.getElementById("cartBtn");
        const homeBtn = this.shadow.getElementById("goHome");

        cartBtn.addEventListener('click', evt => {
            const cartViewEvt = new CustomEvent("goToCart", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(cartViewEvt);
        });

        homeBtn.addEventListener('click', evt => {
            const goHomeEvt = new CustomEvent("goHome", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goHomeEvt);
        });
    }

    //-----------------------------------------------------------------------
    headerComponent() {
        const userOff = this.contentUserOff();

        const headerDiv = document.createElement("div");
        headerDiv.innerHTML = headerHTML;
        headerDiv.classList.add("header");

        this.shadow.appendChild(headerDiv);
        headerDiv.appendChild(userOff);
    }

    //-----------------------------------------------------------------------
    contentUserOff() {
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("rightNav");
        headerDiv.innerHTML = `
            <div class="accountButtons">
                <button id="create">create user</button>
            </div>

            <button id="cartBtn">CART</button>
        `;

        const createUserBtn = headerDiv.querySelector("#create");

        createUserBtn.addEventListener('click', evt => {
            const createUserView = new CustomEvent("goToCreateUser", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(createUserView);
        });

        return headerDiv;
    }
}

//-----------------------------------------------------------------------
customElements.define("user-login-view", LoginUserView);
//-----------------------------------------------------------------------

const headerHTML = `
    <div class="leftNav">
        <button id="goHome">HOME</button>
    </div>
`;

//-----------------------------------------------------------------------
const style = `
    <style>
        .login {
            display: flex;
            flex-direction: column;
            width: 250px;
            gap: 10px;
            margin: 0 auto;
            margin-top: 10px;
        }

        input[type=text], input[type=password] {
            width: 100%;
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }
            
        input[type=text]:focus, input[type=password]:focus {
            outline: none;
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }

        input[type=text]:hover, input[type=password]:hover {
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }

        #loginBtn {
            width: 100px;
            align-self: center;
            color: white;
            border: none;
            border-radius: 5px;
            background: rgb(82, 43, 41);
            transition: 0.3s;
            padding: 10px;
        }

        #loginBtn:hover {
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

        #create {
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

        #create:hover, #cartBtn:hover, #goHome:hover {
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
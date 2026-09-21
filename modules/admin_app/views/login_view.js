export class AdminLogin extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render() {
        this.shadow.innerHTML = style;
        this.loginForm();
        this.loginListner();
    }

    //-----------------------------------------------------------------------
    loginForm() {
        const myDiv = document.createElement("div");
        myDiv.classList.add("loginForm");
        myDiv.innerHTML = `
            <input id="userName" placeholder="Username" type="text" value="">
            <input id="password" placeholder="Password" type="password" value="">
            <button id="loginBtn">Login</button>      
        `;
        this.shadow.appendChild(myDiv);
    }

    //-----------------------------------------------------------------------
    loginListner() {
        const userNameInput = this.shadow.getElementById("userName");
        const userPasswordInput = this.shadow.getElementById("password");
        const loginBtn = this.shadow.getElementById("loginBtn");

        loginBtn.addEventListener('click', evt => {
            const loginEvt = new CustomEvent("loginAdmin", {
                composed: true, bubbles: true,
                detail: {
                    username: userNameInput.value,
                    password: userPasswordInput.value
                }
            });
            this.shadow.dispatchEvent(loginEvt);
        });
    }
}

//-----------------------------------------------------------------------
customElements.define("admin-log-in", AdminLogin);
//-----------------------------------------------------------------------

const style = `
    <style>
        .loginForm {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            width: 250px;
            margin: 0 auto;
            padding: 10px;
        }
        
        input[type=password], input[type=text] {
            width: 100%;
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }

        input:hover {
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }

        input:focus {
            outline: none;
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }

        #loginBtn {
            width: 100px;
            align-self: center;
            color: black;
            border: none;
            border-radius: 5px;
            background: rgba(46, 228, 107, 1);
            transition: 0.3s;
            padding: 10px; 
        }

        #loginBtn:hover {
            cursor: pointer;
            box-shadow: 0px 0px 10px 0px rgba(2, 137, 32, 1) inset;           
        }
    </style>
`;
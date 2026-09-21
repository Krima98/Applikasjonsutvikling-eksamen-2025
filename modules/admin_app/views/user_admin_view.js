export class UserAdminView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render(data) {
        this.shadow.innerHTML = style;
        this.makeHeader();
        this.displayAllUsers(data);
        this.goHomeListener();
        this.deleteAllRatingListener();
    }

    //-----------------------------------------------------------------------
    makeHeader() {
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("header");
        headerDiv.innerHTML = `
            <h1>Users</h1>
            <div class="headerButtons">
                <button id="goHome">HOME</button>
                <button id="deleteBeenz">Delete all user rating</button>
            </div>
        `;
        this.shadow.appendChild(headerDiv);
    }

    //-----------------------------------------------------------------------
    displayAllUsers(data) {
        const allUserDiv = document.createElement("div");
        allUserDiv.classList.add("users");
        this.shadow.appendChild(allUserDiv);

        if (data.length == 0) {
            this.noUsers();
        }

        for (let user of data) {
            const userCard = this.userCard(user);
            allUserDiv.appendChild(userCard);
        }
    }

    //--------------------------------------------------------------
    noUsers() {
        const allUserDiv = this.shadow.querySelector(".users");

        const noUserDiv = document.createElement("div");
        noUserDiv.classList.add("no-users");
        noUserDiv.innerHTML = `
            <h2>Currently no useres</h2>
        `;
        allUserDiv.appendChild(noUserDiv);
    }

    //-----------------------------------------------------------------------
    userCard(user) {
        const userCard = document.createElement("div");
        userCard.classList.add("userCard");
        userCard.innerHTML = `
            <div class="userInfo">
        
                <div class="text">
                    <h2><span>Name:</span> ${user.fullname}</h2>
                    <p><span>Username:</span> ${user.username}</p>
                    <p><span>Adress:</span> ${user.street}, ${user.city}, ${user.zipcode}, ${user.country} </p>
                    <p><span>Rating:</span> ${user.userRating()}</p>
                </div>

                <button id="deleteBtn">DELETE</button>
            </div>
            <hr>
        `;

        const deleteBtn = userCard.querySelector("#deleteBtn");

        deleteBtn.addEventListener('click', evt => {
            const deleteUserEvt = new CustomEvent("deleteUser", { composed: true, bubbles: true, detail: user.userId });
            this.shadow.dispatchEvent(deleteUserEvt);
            userCard.remove();
        });

        return userCard;
    }

    //-----------------------------------------------------------------------
    goHomeListener() {
        const homeBtn = this.shadow.getElementById("goHome");

        homeBtn.addEventListener('click', evt => {
            const goHomeEvt = new CustomEvent("goHome", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goHomeEvt);
        });
    }

    //-----------------------------------------------------------------------
    deleteAllRatingListener() {
        const deleteRating = this.shadow.getElementById("deleteBeenz");

        deleteRating.addEventListener('click', evt => {
            const deleteAllBeenzEvt = new CustomEvent("deleteAllBeenz", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(deleteAllBeenzEvt);
        });
    }
}

//-----------------------------------------------------------------------
customElements.define("all-user-view-admin", UserAdminView);
//-----------------------------------------------------------------------

const style = `
    <style>
        .header {
            color: rgb(233, 233, 233);
            background-color: rgba(15, 15, 15, 1);
            padding: 10px;
        }

        .headerButtons {
            display: flex;
            justify-content: space-between;
        }

        .no-users {
            margin: 10px;
        }

        span {
            font-weight: bold;
        }

        hr, p, h2 {
            margin: 0;
        }  

        p {
            line-height: 1.5;
        }

        .userInfo {
            display: flex;
            justify-content: space-between;
            margin: 10px;
        }

        #deleteBtn {
            width: 100px;
            align-self: center;
            color: black;
            border: none;
            border-radius: 5px;
            background: rgba(255, 66, 66, 1);
            transition: 0.3s;
            padding: 10px; 
            font-weight: bold;
        }

        #goHome, #deleteBeenz {
            border: none;
            border-radius: 5px;
            height: 40px;
            width: 100px;
            padding: 10px; 
            color: black;
            background: rgba(46, 228, 107, 1);
            transition: 0.3s;
        }

        #deleteBeenz {
            width: 150px;
        }

        #deleteBtn:hover, #goHome:hover {
            cursor: pointer;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 1) inset;          
        }

        #deleteBeenz:hover {
            cursor: pointer;
            background: rgba(255, 66, 66, 1);
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 1) inset;          
        }
    </style>
`;
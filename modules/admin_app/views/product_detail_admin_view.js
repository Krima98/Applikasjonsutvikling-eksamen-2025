import { convertDate } from "../../utils.js";

//-----------------------------------------------------------------------
export class DetailAdminView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render(data, order) {
        this.shadow.innerHTML = style;
        this.makeHeader();
        this.detailCard(data, order);
        this.deleteProductListener(data);
        this.navigationListners(data);
        this.checkIfStatic(data);
    }

    //-----------------------------------------------------------------------
    makeHeader() {
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("header");
        headerDiv.innerHTML = `
            <h1>Product Detail</h1>
            <div class="headerButtons">

                <div class="navButtons">
                    <button id="goHome">HOME</button>
                    <button id="goBack">go back</button>
                </div>

                <div class="editButtons">
                    <button id="changeBtn">Change</button>
                    <button id="deleteBtn">Delete</button>
                </div>
                
            </div>
        `;
        this.shadow.appendChild(headerDiv);
    }

    //-----------------------------------------------------------------------
    checkIfStatic(data) {
        const editButtons = this.shadow.querySelector(".editButtons");

        if (data.prodStatic == true) {
            editButtons.remove();
        }
    }

    //-----------------------------------------------------------------------
    detailCard(data, order) {
        const sold = this.findHowManySold(data, order);

        const prodDescr = !data.prodDescr ? "No description" : data.prodDescr;
        const detailDiv = document.createElement("div");
        detailDiv.classList.add("product-detail");
        detailDiv.innerHTML = `
            <div class="quick-info">
                <img src="${data.checkImg()}">

                <div class="info">
                    <p><span>Name:</span> ${data.prodName}</p>
                    <p><span>Price:</span> ${data.checkDiscount()}</p>
                    <p><span>Category:</span> ${data.prodCat}</p>
                    <p><span>Heading:</span> ${data.prodHeading}</p>
                    <p><span>Rating:</span> ${data.checkRating()}</p>
                    <p><span>Discount:</span> ${data.prodDisc}%</p>
                    <p><span>Stock:</span> ${data.checkStock()}</p>
                    <p><span>ShipDate:</span> ${convertDate(data.prodShipDate)}</p>
                    <p><span>Energy:</span> ${data.prodEnergy}</p>
                    <p><span>Carbs:</span> ${data.prodCarb}</p>
                    <p><span>Fat:</span> ${data.prodFat}</p>
                    <p><span>Protein:</span> ${data.prodProtein}</p>
                </div>
            </div>
            <div class="detail-info">
                <div class="description">
                    <h2>Product description</h2>
                    <p>${prodDescr}</p>
                </div>
                <div class="statistic">
                    <h2>Product statistic</h2>
                    <p><span>Number of ratings:</span> ${data.prodNumberOfRating}</p>
                    <p><span>Total in orders now:</span> ${sold}</p>
                </div>
            </div>
        `;
        this.shadow.appendChild(detailDiv);
    }

    //-----------------------------------------------------------------------
    deleteProductListener(data) {
        const deleteBtn = this.shadow.getElementById("deleteBtn");

        deleteBtn.addEventListener('click', evt => {
            this.confirmDeleteDialog(data);
        });
    }

    //-----------------------------------------------------------------------
    confirmDeleteDialog(data) {
        const dialog = document.createElement("dialog");

        dialog.innerHTML = styleDialog + `
            <h1>Confirm delete</h1>
            <div class="dialog-buttons">
                <button id="confirmDeleteBtn">Yes</button>
                <button id="noBtn">No</button>
            </div>
        `;
        document.body.appendChild(dialog);
        dialog.showModal();

        const deleteBtn = dialog.querySelector("#confirmDeleteBtn");
        const noBtn = dialog.querySelector("#noBtn");

        deleteBtn.addEventListener('click', evt => {
            const deleteProdEvt = new CustomEvent("deleteProd", { composed: true, bubbles: true, detail: data.prodId });
            this.shadow.dispatchEvent(deleteProdEvt);
            dialog.close();
        });

        noBtn.addEventListener('click', evt => {
            dialog.close();
        });
    }

    //-----------------------------------------------------------------------
    findHowManySold(data, order) {
        const productId = data.prodNumbId;
        const productList = [];

        for (let item of order) {
            productList.push(JSON.parse(item.products))
        }

        const flatProductList = productList.flat();
        let totalSold = 0;

        for (let item of flatProductList) {
            if (item.prodNum == productId) {
                totalSold += item.quantity;
            }
        }
        return totalSold;
    }

    //-----------------------------------------------------------------------
    navigationListners(data) {
        const goBackBtn = this.shadow.getElementById("goBack");
        const homeBtn = this.shadow.getElementById("goHome");
        const changeBtn = this.shadow.getElementById("changeBtn");

        goBackBtn.addEventListener('click', evt => {
            const goHomeEvt = new CustomEvent("goBackProducts", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goHomeEvt);
        });

        homeBtn.addEventListener('click', evt => {
            const goHomeEvt = new CustomEvent("goHome", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goHomeEvt);
        });

        changeBtn.addEventListener('click', evt => {
            const goToChangeProd = new CustomEvent("goToChangeProd", { composed: true, bubbles: true, detail: data.prodId });
            this.shadow.dispatchEvent(goToChangeProd);
        });
    }
}

//-----------------------------------------------------------------------
customElements.define("detail-view-admin", DetailAdminView);
//-----------------------------------------------------------------------

const styleDialog = `
    <style>
        dialog {
            border: none;
            border-radius: 20px;
            box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 1);
            position: fixed;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .dialog-buttons {
            display: flex;
            gap: 10px;
        }

        #confirmDeleteBtn {
            border: none;
            border-radius: 5px;
            height: 40px;
            width: 100px;
            padding: 10px; 
            color: black;
            background: rgba(46, 228, 107, 1);
            transition: 0.3s;
        }

        #noBtn {
            border: none;
            border-radius: 5px;
            height: 40px;
            width: 100px;
            padding: 10px; 
            color: black;
            background: rgba(228, 46, 46, 1);
            transition: 0.3s;     
        }

        #confirmDeleteBtn:hover, #noBtn:hover {
            cursor: pointer;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 1) inset;       
        }
    </style>
`;

//-----------------------------------------------------------------------
const style = `
    <style>
        span {
            font-weight: bold;
        }

        p {
            margin: 0;
            line-height: 1.5;
        }

        h2 {
            margin: 0;
        }

        .product-detail {
            margin: 10px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .quick-info {
            display: flex;
            gap: 10px;
        }

        .header {
            color: rgb(233, 233, 233);
            background-color: rgba(15, 15, 15, 1);
            padding: 10px;
        }

        .headerButtons {
            display: flex;
            justify-content: space-between;
        }

        #deleteBtn, #changeBtn, #goBack, #goHome {
            border: none;
            border-radius: 5px;
            height: 40px;
            width: 100px;
            padding: 10px; 
            color: black;
            background: rgba(46, 228, 107, 1);
            transition: 0.3s;
        }

        #goBack:hover, #goHome:hover {
            cursor: pointer;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 1) inset;           
        }

        #changeBtn:hover{
            cursor: pointer;
            background-color: rgba(230, 237, 43, 1);
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 1) inset;           
        }

        #deleteBtn:hover {
            cursor: pointer;
            background-color: rgba(220, 28, 28, 1);
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 1) inset;          
        }
    </style>
`;
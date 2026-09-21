import { checkLength } from "../../utils.js";
//-----------------------------------------------------------------------

export class AddProductView extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    //-----------------------------------------------------------------------
    render() {
        this.shadow.innerHTML = style;
        this.makeHeader();
        this.formData();
        this.navigationListners();
    }

    //-----------------------------------------------------------------------
    makeHeader() {
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("header");
        headerDiv.innerHTML = `
            <h1>Add Product</h1>
            <div class="headerButtons">
                <button id="goHome">HOME</button>
                <button id="goBack">go back</button>
            </div>
        `;
        this.shadow.appendChild(headerDiv);
    }

    //-----------------------------------------------------------------------
    formData() {
        const formDiv = document.createElement("div");
        formDiv.classList.add("form");
        formDiv.innerHTML = `
        <form id="formData">
            <input name="name" type="text" placeholder="Product name" required>

            <select name="category_id">
                <option value="">Category</option>
                <option value="1">Special</option>
                <option value="2">Caramel</option>
                <option value="3">Jelly</option>
                <option value="4">Marshmallow</option>
                <option value="5">Chocolate</option>
                <option value="6">Packaging</option>
                <option value="7">Equipment</option>
            </select>

            <input name="heading" type="text" placeholder="heading">
            <textarea name="description" type="text" placeholder="Product description"></textarea>
            <input name="energy" type="number" placeholder="Product energy">
            <input name="fat" type="number" placeholder="Product fat">
            <input name="protein" type="number" placeholder="Product protein">
            <input name="carbohydrates" type="number" placeholder="Product carbohydrates">
            <input name="price" type="number"placeholder="Product price" required>
            <input name="discount" type="number" placeholder="Product discount">
            <input id="stockInp" name="stock" type="number" placeholder="Product stock">
            <input id="dateInp" name="expected_shipped" type="date">
            
            <select name="reserved_members">
                <option value="">Member</option>
                <option value="true">yes</option>
                <option value="false">no</option>
            </select>
            <input name="img_file" id="imgFile" type="file">

            <input id="addBtn" type="submit" value="Add product">
        </form>
        `;
        this.shadow.appendChild(formDiv);
        this.isThereStock();

        this.sendDataListener();
    }

    //-----------------------------------------------------------------------
    sendDataListener() {
        const today = this.convertToDateInputValue();

        const theForm = this.shadow.getElementById("formData");
        theForm.addEventListener('submit', evt => {

            if (theForm.stock.value > 0) {
                theForm.expected_shipped.value = today;
            }

            evt.preventDefault();
            const addProdEvt = new CustomEvent("addProduct", { composed: true, bubbles: true });
            addProdEvt.productForm = new FormData(theForm);
            this.shadow.dispatchEvent(addProdEvt);
        });
    }

    //-----------------------------------------------------------------------
    convertToDateInputValue() {
        const today = new Date();

        const year = today.getUTCFullYear();
        const day = checkLength(today.getUTCDate());
        const month = checkLength(today.getUTCMonth() + 1);

        return year + "-" + month + "-" + day;
    }

    //-----------------------------------------------------------------------
    isThereStock() {
        const theForm = this.shadow.getElementById("formData");
        const stockInput = this.shadow.getElementById("stockInp");
        const dateInput = this.shadow.getElementById("dateInp");

        theForm.addEventListener('change', evt => {
            if (Number(stockInput.value) > 0) {
                dateInput.style.display = "none";
            } else {
                dateInput.style.display = "";
            }
        });
    }

    //-----------------------------------------------------------------------
    navigationListners() {
        const homeBtn = this.shadow.getElementById("goHome");
        const goBackBtn = this.shadow.getElementById("goBack");

        homeBtn.addEventListener('click', evt => {
            const goHomeEvt = new CustomEvent("goHome", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goHomeEvt);
        });

        goBackBtn.addEventListener('click', evt => {
            const goHomeEvt = new CustomEvent("goBackProducts", { composed: true, bubbles: true });
            this.shadow.dispatchEvent(goHomeEvt);
        });
    }
}

//-----------------------------------------------------------------------
customElements.define("add-product-form", AddProductView);
//-----------------------------------------------------------------------

//-----------------------------------------------------------------------
const style = `
    <style>
        .header {
            color: rgb(233, 233, 233);
            background-color: rgba(15, 15, 15, 1);
            padding: 10px;         
        }

        textarea {
            height: 80px;
            resize: none;
            border: none;
            border-radius: 4px;
            padding: 5px;
            font-family: Arial, Helvetica, sans-serif;
        }

        textarea:hover, select:hover {
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }

        textarea:focus, select:focus {
            outline: none;
            box-shadow: 0px 0px 5px 0px rgb(142, 142, 142) inset;
        }

        #goHome, #goBack {
            border: none;
            border-radius: 5px;
            height: 40px;
            width: 100px;
            padding: 10px; 
            color: black;
            background: rgba(46, 228, 107, 1);
            transition: 0.3s;
        }

        #goHome:hover, #goBack:hover, #changeBnt:hover {
            cursor: pointer;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 1) inset; 
        }

        .form {
            margin: 30px;
        }

        #formData {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        #addBtn {
            width: 100px;
            align-self: center;
            color: black;
            border: none;
            border-radius: 5px;
            background: rgba(46, 228, 107, 1);
            transition: 0.3s;
            padding: 10px; 
        }

        #addBtn:hover {
            cursor: pointer;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 1) inset;
        }

        input[type=text], input[type=number], input[type=email], input[type=date], select {
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

        input[type=email]:hover {
            cursor: pointer;
        }
    </style>
`;

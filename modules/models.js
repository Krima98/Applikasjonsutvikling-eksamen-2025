import { convertDate } from "./utils.js";
import { CONFIG } from "./config.js";

export class CategoryModel {

    setApiData(apiData) {
        this.catId = apiData.id;
        this.catName = apiData.category_name;
    }
}

//--------------------------------------------------------------
export class ShipMethodsModel {

    setApiData(apiData) {
        this.shipId = apiData.id;
        this.shipType = apiData.type;
        this.shipPrice = apiData.price;
    }
}

//--------------------------------------------------------------
export class ProductModel {

    setApiData(apiData) {
        this.prodName = apiData.name;
        this.prodPrice = apiData.price;
        this.prodDisc = apiData.discount;
        this.prodImgSmall = `${CONFIG.BASE_URL}/images/GFTPOE21/small/` + apiData.thumb;
        this.prodId = apiData.id;
        this.member = apiData.reserved_members;
        this.prodImgDefault = `${CONFIG.BASE_URL}/images/${CONFIG.API_KEY}/small/` + apiData.thumb;
        this.prodStatic = apiData.static;
        this.prodStock = apiData.stock;
        this.rating = apiData.rating;
        this.prodCat = apiData.category_name;

    }

    //--------------------------------------------------------------
    checkImg() {

        if (!this.prodStatic) {
            return this.prodImgDefault;
        } else {
            return this.prodImgSmall;
        }
    }

    //--------------------------------------------------------------
    checkDiscountListView() {

        if (!this.prodDisc) {
            return this.prodPrice;
        } else {
            const discountPrice = this.prodPrice - (this.prodPrice * this.prodDisc / 100);
            return Math.floor(discountPrice);
        }
    }

    //--------------------------------------------------------------
    checkStockRemaining() {

        if (this.prodStock == 0) {
            return "need restock";
        } else if (this.prodStock < 10) {
            return "Need restock ASAP!";
        } else if (this.prodStock < 30) {
            return "Less than 30, consider restocking";
        } else {
            return "No need to restock";
        }
    }

    //--------------------------------------------------------------
    checkRating() {

        let rating = "";
        for (let i = 0; i < this.rating; i++) {
            rating += "⭐";
        }
        if (!rating) {
            return "No rating yet"
        }
        return rating;
    }
}

//--------------------------------------------------------------
export class DetailProduct {

    setApiData(apiData) {
        this.prodId = apiData.id;
        this.prodNumbId = apiData.product_num;
        this.prodStatic = apiData.static;
        this.prodPrice = apiData.price;
        this.prodDisc = apiData.discount;
        this.discountPrice = this.prodPrice - (this.prodPrice * this.prodDisc / 100);
        this.prodName = apiData.name;
        this.prodCat = apiData.category_name;
        this.prodHeading = apiData.heading;
        this.prodDescr = apiData.description;
        this.prodImgBig = `${CONFIG.BASE_URL}/images/GFTPOE21/large/` + apiData.image;
        this.prodImgDefault = `${CONFIG.BASE_URL}/images/${CONFIG.API_KEY}/large/` + apiData.image;
        this.prodRate = apiData.rating;
        this.prodStock = apiData.stock;
        this.prodCarb = apiData.carbohydrates;
        this.prodFat = apiData.fat;
        this.prodProtein = apiData.protein;
        this.prodEnergy = apiData.energy;
        this.prodShipDate = apiData.expected_shipped;
        this.prodNumberOfRating = apiData.number_of_ratings;
    }

    //--------------------------------------------------------------
    checkRating() {

        let rating = "";
        for (let i = 0; i < this.prodRate; i++) {
            rating += "⭐";
        }
        if (!rating) {
            return "No rating yet"
        }
        return rating;
    }

    //--------------------------------------------------------------
    checkStock() {
        if (!this.prodStock) {
            return `shipping date ${convertDate(this.prodShipDate)}`;
        } else
            return this.prodStock;
    }

    //--------------------------------------------------------------
    checkImg() {
        if (this.prodStatic == true) {
            return this.prodImgBig;
        } else {
            return this.prodImgDefault;
        }
    }

    //--------------------------------------------------------------
    checkDiscount() {
        if (this.prodDisc === "0") {
            return this.prodPrice + ',- kr';
        } else {
            return Math.floor(this.discountPrice) + `,- kr / From  ${this.prodPrice},- kr`;
        }
    }
}

//--------------------------------------------------------------
export class OrderModel {
    setApiData(apiData) {
        this.personName = apiData.customer_name;
        this.street = apiData.street;
        this.city = apiData.city;
        this.zipcode = apiData.zipcode;
        this.country = apiData.country;
        this.shipId = apiData.shipping_id;
        this.products = apiData.content;
        this.email = apiData.email;
        this.phone = apiData.phone;
        this.orderId = apiData.id;
        this.orderNumb = apiData.ordernumber;
        this.orderDate = apiData.date;
        this.userId = apiData.user_id;
    }
}

//--------------------------------------------------------------
export class UserModel {
    setApiData(apiData) {
        this.fullname = apiData.full_name;
        this.username = apiData.username;
        this.street = apiData.street;
        this.city = apiData.city;
        this.zipcode = apiData.zipcode;
        this.country = apiData.country;
        this.img = `${CONFIG.BASE_URL}/images/${CONFIG.API_KEY}/users/` + apiData.thumb
        this.beenz = apiData.beenz;
        this.userId = apiData.id;
    }

    //--------------------------------------------------------------
    userRating() {
        let rating = "";

        for (let i = 0; i < this.beenz; i++) {
            rating += "⭐";
        }

        if (this.beenz == null) {
            return `No user rating`;
        } else {
            return rating;
        }
    }
}

//--------------------------------------------------------------
export class ReviewModel {
    setApiData(apiData) {
        this.comment = apiData.comment_text;
        this.rating = apiData.rating;
        this.userId = apiData.user_id;
        this.productId = apiData.product_id;
        this.commentId = apiData.id;
        this.commentDate = apiData.date;
    }

    //--------------------------------------------------------------
    productRating() {
        let rating = "";

        for (let i = 0; i < this.rating; i++) {
            rating += "⭐";
        }
        return rating;
    }
}

//--------------------------------------------------------------
export class PostModel {
    setApiData(apiData) {
        this.postId = apiData.id;
        this.heading = apiData.heading;
        this.postMsg = apiData.message;
        this.threadId = apiData.thread;
        this.userId = apiData.user_id;
        this.prodThredStart = apiData.start_of_thread;
        this.date = apiData.date;
    }
}
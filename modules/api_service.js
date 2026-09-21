
import { sendRequest, createBasicAuthString, checkToken } from "./utils.js";
import { CategoryModel, ProductModel, DetailProduct, ShipMethodsModel, OrderModel, UserModel, ReviewModel, PostModel } from "./models.js";
import { errorHandler } from "./error_handler.js";
import { CONFIG } from "./config.js";

//--------------------------------------------------------------
export async function getAllProducts() {

    const url = `${CONFIG.BASE_URL}/webshop/products?key=${CONFIG.API_KEY}`;
    const token = checkToken();

    let cfg = {
        method: "GET",
        headers: { "authorization": "Bearer " + token }
    };

    try {
        const data = await sendRequest(url, cfg);

        const modelData = data.map(function (value) {
            const product = new ProductModel();
            product.setApiData(value);
            return product;
        });
        return modelData;

    } catch (error) {
        errorHandler(error);
    }
}

//--------------------------------------------------------------
export async function getCategories() {

    const url = `${CONFIG.BASE_URL}/webshop/categories?key=${CONFIG.API_KEY}`;

    try {
        const data = await sendRequest(url);

        const modelData = data.map(function (value) {
            const category = new CategoryModel();
            category.setApiData(value);
            return category;
        });
        return modelData;

    } catch (error) {
        errorHandler("a problem has occurred");
    }
}

//--------------------------------------------------------------------- 
export async function getProducts(category) {

    const url = `${CONFIG.BASE_URL}/webshop/products?category=${category}&key=${CONFIG.API_KEY}`;

    const userToken = localStorage.getItem("userToken");

    const cfg = {
        headers: userToken ? { 'Authorization': `Bearer ${userToken}` } : {}
    };

    try {
        const data = await sendRequest(url, cfg);

        const modelData = data.map(function (value) {
            const product = new ProductModel();
            product.setApiData(value);
            return product;
        });
        return modelData;

    } catch (error) {
        return errorHandler("Server could not recive products");
    }
}
//---------------------------------------------------------------------
export async function getProductsSearch(search) {

    const url = `${CONFIG.BASE_URL}/webshop/products?search=${search}&key=${CONFIG.API_KEY}`;

    const userToken = localStorage.getItem("userToken");

    const cfg = {
        headers: userToken ? { 'Authorization': `Bearer ${userToken}` } : {}
    };

    try {
        const data = await sendRequest(url, cfg);

        const modelData = data.map(function (value) {
            const product = new ProductModel();
            product.setApiData(value);
            return product;
        });

        return modelData;

    } catch (error) {
        errorHandler("Server could not recive products from search. Please try again, or contact sukkergris@support.no");
    }
}

//--------------------------------------------------------------
export async function getProductsDetail(id) {

    const url = `${CONFIG.BASE_URL}/webshop/products?id=${id}&key=${CONFIG.API_KEY}`;

    const userToken = localStorage.getItem("userToken");

    const cfg = {
        headers: userToken ? { 'Authorization': `Bearer ${userToken}` } : {}
    };

    try {
        const data = await sendRequest(url, cfg);
        const modelData = new DetailProduct();
        modelData.setApiData(data[0]);
        return modelData;

    } catch (error) {
        errorHandler(error);
    }
}

//--------------------------------------------------------------
export async function getProductDetailAdmin(id) {

    const url = `${CONFIG.BASE_URL}/webshop/products?id=${id}&key=${CONFIG.API_KEY}`;

    const adminToken = sessionStorage.getItem("adminToken");

    const cfg = {
        headers: { "authorization": "Bearer " + adminToken }
    };

    try {
        const data = await sendRequest(url, cfg);
        const modelData = new DetailProduct();
        modelData.setApiData(data[0]);
        return modelData;

    } catch (error) {
        errorHandler(error);
    }
}

//--------------------------------------------------------------
export async function admingLogin(username, password) {

    let credString = createBasicAuthString(username, password);
    const url = `${CONFIG.BASE_URL}/users/adminlogin?key=${CONFIG.API_KEY}`;

    let cfg = {
        method: "POST",
        headers: { "Authorization": credString }
    };

    try {
        const data = await sendRequest(url, cfg);

        sessionStorage.setItem("adminToken", data.logindata.token);

        return data;

    } catch (error) {
        errorHandler("Could not connect to the server");
    }
}

//--------------------------------------------------------------
export async function addProduct(dataForm) {

    const url = `${CONFIG.BASE_URL}/webshop/products?key=${CONFIG.API_KEY}`;
    const adminToken = sessionStorage.getItem("adminToken");

    const cfg = {
        method: "POST",
        headers: { "authorization": "Bearer " + adminToken },
        body: dataForm
    };

    try {
        const data = await sendRequest(url, cfg);
        return data;

    } catch (error) {
        errorHandler("The server could not add a product, check api service");
    }
}

//--------------------------------------------------------------
export async function deleteProduct(id) {

    const url = `${CONFIG.BASE_URL}/webshop/products?id=${id}&key=${CONFIG.API_KEY}`;
    const adminToken = sessionStorage.getItem("adminToken");

    const cfg = {
        method: "DELETE",
        headers: { "authorization": "Bearer " + adminToken },
    };

    try {
        const data = await sendRequest(url, cfg);
        return data;

    } catch (error) {
        errorHandler("The server could not delete a product, check api service");
    }
}

//--------------------------------------------------------------
export async function changeProduct(dataForm, id) {

    const url = `${CONFIG.BASE_URL}/webshop/products?id=${id}&key=${CONFIG.API_KEY}`;
    const adminToken = sessionStorage.getItem("adminToken");

    const cfg = {
        method: "PUT",
        headers: { "authorization": "Bearer " + adminToken },
        body: dataForm
    };

    try {
        const data = await sendRequest(url, cfg);
        return data;

    } catch (error) {
        errorHandler("The server could not change a product, check api service");
    }
}

//--------------------------------------------------------------
export async function getShipMethods() {
    const url = `${CONFIG.BASE_URL}/logistics/shippingtypes?key=${CONFIG.API_KEY}`;

    try {
        const data = await sendRequest(url);

        const modelData = data.map(function (value) {
            const shipMethods = new ShipMethodsModel();
            shipMethods.setApiData(value);
            return shipMethods;
        });
        return modelData;

    } catch (error) {
        errorHandler("Could not retrive shipping data from the server. Please try again, or contact sukkergris@support.no");
    }
}

//--------------------------------------------------------------
export async function getAllOrderes() {

    const url = `${CONFIG.BASE_URL}/webshop/orders?key=${CONFIG.API_KEY}`;
    const token = checkToken();

    let cfg = {
        method: "GET",
        headers: { "authorization": "Bearer " + token }
    };

    try {

        const data = await sendRequest(url, cfg);

        const modelData = data.map(function (value) {
            const order = new OrderModel();
            order.setApiData(value);
            return order;
        });
        return modelData;

    } catch (error) {
        errorHandler("Could not retrive orders from server. Please try again, or contact sukkergris@support.no");
    }
}

//--------------------------------------------------------------
export async function sendOrder(dataObj) {

    const url = `${CONFIG.BASE_URL}/webshop/orders?key=${CONFIG.API_KEY}`;
    const userToken = localStorage.getItem("userToken");

    const cfg = {
        method: "POST",
        headers: userToken ? { "authorization": "Bearer " + userToken, "content-type": "application/json" } : { "content-type": "application/json" },
        body: JSON.stringify(dataObj)
    };

    try {
        const data = await sendRequest(url, cfg);
        return data;

    } catch (error) {
        errorHandler("Server could not get the order. Please try again, or contact sukkergris@support.no");
    }
}

//--------------------------------------------------------------
export async function deleteOrder(id) {

    const url = `${CONFIG.BASE_URL}/webshop/orders?id=${id}&key=${CONFIG.API_KEY}`;
    const adminToken = sessionStorage.getItem("adminToken");

    const cfg = {
        method: "DELETE",
        headers: { "authorization": "Bearer " + adminToken },
    };

    try {
        const data = await sendRequest(url, cfg)
        return data;

    } catch (error) {
        errorHandler("The server could not delete the order. Check api service");
    }
}

//--------------------------------------------------------------
export async function addUser(userForm) {
    const url = `${CONFIG.BASE_URL}/users?key=${CONFIG.API_KEY}`;

    const cfg = {
        method: "POST",
        body: userForm
    };

    try {
        const data = await sendRequest(url, cfg);
        return data;

    } catch (error) {
        errorHandler("Username needs to be unique");
    }
}

//--------------------------------------------------------------
export async function userLogin(username, password) {

    let credString = createBasicAuthString(username, password);
    const url = `${CONFIG.BASE_URL}/users/login?key=${CONFIG.API_KEY}`;

    let cfg = {
        method: "POST",
        headers: { "Authorization": credString }
    };

    try {
        const data = await sendRequest(url, cfg);

        localStorage.setItem("userToken", data.logindata.token);
        localStorage.setItem("userid", data.logindata.userid);
        localStorage.setItem("userProfileImg", data.logindata.thumb);
        localStorage.setItem("userInfo", JSON.stringify(data.logindata));

        return data;

    } catch (error) {
        errorHandler("wrong username or password");
    }
}

//--------------------------------------------------------------
export async function getUser(id) {

    const url = `${CONFIG.BASE_URL}/users?userid=${id}&key=${CONFIG.API_KEY}`;
    const userToken = localStorage.getItem("userToken");

    let cfg = {
        method: "GET",
        headers: { "authorization": "Bearer " + userToken },
    };

    try {
        const data = await sendRequest(url, cfg);
        const modelData = new UserModel();
        modelData.setApiData(data[0]);
        return modelData;

    } catch (error) {
        errorHandler("Server could not recive your user information. Please try again, or contact sukkergris@support.no");
    }
}

//-------------------------------------------------------------- 
export async function getAllUsers() {

    const url = `${CONFIG.BASE_URL}/users?key=${CONFIG.API_KEY}`;
    const token = checkToken();

    let cfg = {
        method: "GET",
        headers: { 'Authorization': `Bearer ${token}` },
    };

    try {

        const data = await sendRequest(url, cfg);
        const modelData = data.map(function (value) {
            const user = new UserModel();
            user.setApiData(value);
            return user;
        });
        return modelData;

    } catch (error) {
        errorHandler("Server could not recive user information");
    }
}

//--------------------------------------------------------------
export async function changeUser(formData) {

    const url = `${CONFIG.BASE_URL}/users?key=${CONFIG.API_KEY}`;
    const userToken = localStorage.getItem("userToken");

    const cfg = {
        method: "PUT",
        headers: { "authorization": "Bearer " + userToken },
        body: formData
    };

    try {
        const data = await sendRequest(url, cfg)
        localStorage.setItem("userProfileImg", data.record.thumb);
        localStorage.setItem("userInfo", JSON.stringify(data.record));

        return data;

    } catch (error) {
        errorHandler("The server could not change the user information. Please try again, or contact sukkergris@support.no");
    }
}

//--------------------------------------------------------------
export async function userDeleteMe() {

    const url = `${CONFIG.BASE_URL}/users?key=${CONFIG.API_KEY}`;
    const userToken = localStorage.getItem("userToken");

    const cfg = {
        method: "DELETE",
        headers: { "authorization": "Bearer " + userToken },
    };

    try {
        const data = await sendRequest(url, cfg);
        localStorage.removeItem("userToken");
        return data;

    } catch (error) {
        errorHandler("Problem occurred, could not delete your profile. Please try again, or contact sukkergris@support.no");
    }
}

//--------------------------------------------------------------
export async function deleteUserAdmin(id) {

    const url = `${CONFIG.BASE_URL}/users?id=${id}&key=${CONFIG.API_KEY}`;
    const adminToken = sessionStorage.getItem("adminToken");

    const cfg = {
        method: "DELETE",
        headers: { "authorization": "Bearer " + adminToken },
    };

    try {
        const data = await sendRequest(url, cfg);
        return data;

    } catch (error) {
        errorHandler("The server could not delete user. Check api service");
    }
}

//--------------------------------------------------------------
export async function deleteBeenz() {

    const url = `${CONFIG.BASE_URL}/users/beenz?key=${CONFIG.API_KEY}`;
    const adminToken = sessionStorage.getItem("adminToken");

    const cfg = {
        method: "DELETE",
        headers: { "authorization": "Bearer " + adminToken },
    };

    try {
        const data = await sendRequest(url, cfg);
        return data;

    } catch (error) {
        errorHandler("The server could not delete all beenz rating. Check api service");
    }
}

//--------------------------------------------------------------
export async function deleteReview(id) {

    const url = `${CONFIG.BASE_URL}/comments?comment_id=${id}&key=${CONFIG.API_KEY}`;
    const token = checkToken();

    const cfg = {
        method: "DELETE",
        headers: { "authorization": "Bearer " + token },
    };

    try {
        const data = await sendRequest(url, cfg);
        return data;

    } catch (error) {
        errorHandler("Problem occurred, could not delete your review. Please try again, or contact sukkergris@support.no");
    }
}

//--------------------------------------------------------------
export async function sendReview(dataObj) {

    const url = `${CONFIG.BASE_URL}/webshop/comments?key=${CONFIG.API_KEY}`;
    const userToken = localStorage.getItem("userToken");

    const cfg = {
        method: "POST",
        headers: { "authorization": "Bearer " + userToken, "content-type": "application/json" },
        body: JSON.stringify(dataObj)
    };

    try {
        const data = await sendRequest(url, cfg);
        return data;

    } catch (error) {
        errorHandler("Problem occurred, could not send review. Please try again, or contact sukkergris@support.no");
    }
}

//--------------------------------------------------------------
export async function getReviews(id) {

    const url = `${CONFIG.BASE_URL}/webshop/comments?product_id=${id}&key=${CONFIG.API_KEY}`;
    const userToken = localStorage.getItem("userToken");

    let cfg = {
        method: "GET",
        headers: userToken ? { 'Authorization': `Bearer ${userToken}` } : {},
    };

    try {

        const data = await sendRequest(url, cfg);

        const modelData = data.map(function (value) {
            const comments = new ReviewModel();
            comments.setApiData(value);
            return comments;
        });
        return modelData;

    } catch (error) {
        errorHandler("could not get reviews. Please try again, or contact sukkergris@support.no");
    }
}

//--------------------------------------------------------------
export async function getAllReviews() {

    const url = `${CONFIG.BASE_URL}/webshop/comments?key=${CONFIG.API_KEY}`;
    const adminToken = sessionStorage.getItem("adminToken");

    let cfg = {
        method: "GET",
        headers: { 'Authorization': `Bearer ${adminToken}` }
    };

    try {
        const data = await sendRequest(url, cfg);

        const modelData = data.map(function (value) {
            const comments = new ReviewModel();
            comments.setApiData(value);
            return comments;
        })
        return modelData;

    } catch (error) {
        errorHandler("could not get all your reviews. Pleas try again, or contact sukkergris@support.no");
    }
}

//--------------------------------------------------------------
export async function getAllReviewsUser() {

    const url = `${CONFIG.BASE_URL}/webshop/comments?key=${CONFIG.API_KEY}`;
    const userToken = localStorage.getItem("userToken");

    let cfg = {
        method: "GET",
        headers: { 'Authorization': `Bearer ${userToken}` }
    };

    try {
        const data = await sendRequest(url, cfg);

        const modelData = data.map(function (value) {
            const comments = new ReviewModel();
            comments.setApiData(value);
            return comments;
        })
        return modelData;

    } catch (error) {
        errorHandler("could not get all your reviews. Pleas try again, or contact sukkergris@support.no");
    }
}

//--------------------------------------------------------------
export async function showAllPosts() {

    const url = `${CONFIG.BASE_URL}/msgboard/messages?key=${CONFIG.API_KEY}&all=true`;
    const token = checkToken();

    let cfg = {
        method: "GET",
        headers: { 'Authorization': `Bearer ${token}` },
    };

    try {
        const data = await sendRequest(url, cfg);

        const modelData = data.map(function (value) {
            const post = new PostModel();
            post.setApiData(value);
            return post;
        });
        return modelData;

    } catch (error) {
        errorHandler("Could not recive all the post");
    }
}

//--------------------------------------------------------------
export async function getOwnPosts() {

    const url = `${CONFIG.BASE_URL}/msgboard/messages?key=${CONFIG.API_KEY}&all=false`;
    const userToken = localStorage.getItem("userToken");

    let cfg = {
        method: "GET",
        headers: { 'Authorization': `Bearer ${userToken}` },
    };

    try {

        const data = await sendRequest(url, cfg);
        const modelData = data.map(function (value) {
            const post = new PostModel();
            post.setApiData(value);
            return post;
        });
        return modelData;

    } catch (error) {
        errorHandler("Could not recive all your posts. Please try again, or contact sukkergrist@support.no");
    }
}

//--------------------------------------------------------------
export async function getPost(threadId) {

    const url = `${CONFIG.BASE_URL}/msgboard/messages?key=${CONFIG.API_KEY}&thread=${threadId}`;
    const token = checkToken();

    let cfg = {
        method: "GET",
        headers: { 'Authorization': `Bearer ${token}` },
    };

    try {
        const data = await sendRequest(url, cfg);

        const modelData = data.map(function (value) {
            const post = new PostModel();
            post.setApiData(value);
            return post;
        });
        return modelData;

    } catch (error) {
        errorHandler(error);
    }

}

//--------------------------------------------------------------
export async function makeNewPost(dataObj) {

    const url = `${CONFIG.BASE_URL}/msgboard/messages?key=${CONFIG.API_KEY}`;
    const userToken = localStorage.getItem("userToken");

    const cfg = {
        method: "POST",
        headers: { "authorization": "Bearer " + userToken, "content-type": "application/json" },
        body: JSON.stringify(dataObj)
    };

    try {
        const data = await sendRequest(url, cfg);

        return data;

    } catch (error) {
        errorHandler("The server could not post a new post. Please try again, or contact sukkergris@support.no");
    }
}

//--------------------------------------------------------------
export async function commentPost(dataObj, thread) {

    const url = `${CONFIG.BASE_URL}/msgboard/messages?key=${CONFIG.API_KEY}&thread=${thread}`;
    const userToken = localStorage.getItem("userToken");

    const cfg = {
        method: "POST",
        headers: { "authorization": "Bearer " + userToken, "content-type": "application/json" },
        body: JSON.stringify(dataObj)
    };

    try {
        const data = await sendRequest(url, cfg);
        return data;

    } catch (error) {
        errorHandler("The server could not publish your comment. Please try again, or contact sukkergris@support.no");
    }
}

//--------------------------------------------------------------
export async function deleteMessagePost(id) {

    const url = `${CONFIG.BASE_URL}/msgboard/messages?message_id=${id}&key=${CONFIG.API_KEY}`
    const token = checkToken();

    const cfg = {
        method: "DELETE",
        headers: { "authorization": "Bearer " + token },
    };

    try {
        const data = await sendRequest(url, cfg);
        return data;

    } catch (error) {
        errorHandler("The server could not delete the post or the comment. Please try again, or contact sukkergris@support.no");
    }
}

//--------------------------------------------------------------
export async function rateUser(dataObj) {

    const url = `${CONFIG.BASE_URL}/users/beenz?key=${CONFIG.API_KEY}`;
    const userToken = localStorage.getItem("userToken");

    const cfg = {
        method: "PUT",
        headers: { "authorization": "Bearer " + userToken, "content-type": "application/json" },
        body: JSON.stringify(dataObj)
    };

    try {

        const data = await sendRequest(url, cfg);
        return data;

    } catch (error) {
        errorHandler("Server could not rate a user. Please try again, or contact sukkergris@support.no");
    }
}
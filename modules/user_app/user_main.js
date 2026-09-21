import { errorHandler } from "../error_handler.js";
import { showMessage } from "../msg_handler.js";
import * as api from "../api_service.js";
import { CategoryView } from "./views/category_view.js";
import { ProductListView } from "./views/product_list_view.js";
import { DetailView } from "./views/detail_product_view.js";
import { CartView } from "./views/cart_view.js";
import { CheckoutView } from "./views/checkout_view.js";
import { CreateUserView } from "./views/add_user_view.js"
import { LoginUserView } from "./views/login_user_view.js";
import { UserSettingView } from "./views/user_settings_view.js";
import { ChangeUserView } from "./views/change_user.js";
import { CommentsAndReviewView } from "./views/comments_review_view.js";
import { MessageBoardView } from "./views/messageBoard_view.js";
import { OrderUserView } from "./views/order_user_view.js";
import { OrderDetailUserView } from "./views/order_detail_user_view.js";
import { AddPostView } from "./views/add_post_user_view.js";
import { DetailMessageBoardView } from "./views/messageBoard_detail_view.js";
import { ReviewDeleteView } from "./views/delete_review_view.js";
import { OrderConfirmationView } from "./views/order_confirmation_view.js";
import { OwnMessagePostDeleteView } from "./views/messageBoard_own_post_view.js";

//-----------------------------------------------------------------------
const categoryView = new CategoryView();
const productView = new ProductListView();
const detailView = new DetailView();
const cartView = new CartView();
const checkoutView = new CheckoutView();
const orderConfirmationView = new OrderConfirmationView();
const createUserView = new CreateUserView();
const loginUserView = new LoginUserView();
const userSettingView = new UserSettingView();
const changeUserView = new ChangeUserView();
const commentAndReviewView = new CommentsAndReviewView();
const messageBoardView = new MessageBoardView();
const orderUserView = new OrderUserView();
const orderDetailUserView = new OrderDetailUserView();
const addPostView = new AddPostView();
const detailMessageBoardView = new DetailMessageBoardView();
const userDeleteReview = new ReviewDeleteView();
const ownMessagePostDeleteView = new OwnMessagePostDeleteView();

//-----------------------------------------------------------------------
const container = document.getElementById("container");

//-----------------------------------------------------------------------
const viewMap = {
    "catView": categoryView,
    "prodView": productView,
    "detailView": detailView,
    "cartView": cartView,
    "checkoutView": checkoutView,
    "orderConfirmationView": orderConfirmationView,
    "createUserView": createUserView,
    "loginUserView": loginUserView,
    "userSettingView": userSettingView,
    "changeUserView": changeUserView,
    "commentAndReviewView": commentAndReviewView,
    "messageBoardView": messageBoardView,
    "orderUserView": orderUserView,
    "orderDetailUserView": orderDetailUserView,
    "addPostView": addPostView,
    "detailMessageBoardView": detailMessageBoardView,
    "userDeleteReview": userDeleteReview,
    "ownMessagePostDeleteView": ownMessagePostDeleteView
}

//----------------------------------------------------------------------
function navigateTo(view) {
    container.innerHTML = "";
    container.appendChild(viewMap[view]);
}

//----------------------------------------------------------------------
// start
const categories = await api.getCategories();
categoryView.render(categories);
navigateTo("catView");

//==========================CATEGORY NAVIGATION===================================
categoryView.addEventListener('categorySelected', async function (evt) {
    const categoryId = evt.detail;
    const products = await api.getProducts(categoryId);
    productView.render(products);
    navigateTo("prodView");
});

//-----------------------------------------------------------------------
categoryView.addEventListener('searchProduct', async function (evt) {
    const userInput = evt.detail;
    const products = await api.getProductsSearch(userInput);
    if (products.length === 0) {
        return errorHandler("Your search did not match any products");
    }
    productView.render(products);
    navigateTo("prodView");
});

//==========================PRODUCT NAVIGATION===============================
productView.addEventListener('productSelected', async function (evt) {
    const productId = evt.detail;
    const data = await api.getProductsDetail(productId);
    detailView.render(data);
    navigateTo("detailView");
});

//==========================DETAIL PRODUCT NAVIGATION=========================
detailView.addEventListener('sendReview', async function (evt) {
    const review = evt.reviewForm;
    const result = await api.sendReview(review);
    if (result) {
        const productId = review.product_id;
        const data = await api.getProductsDetail(productId);
        detailView.render(data);
        navigateTo("detailView");
        showMessage("Thank you for your review")
    }
});

//-----------------------------------------------------------------------
detailView.addEventListener('goReviewView', async function (evt) {
    const prodId = evt.detail;
    const prodName = evt.productName;
    const data = await api.getReviews(prodId);
    commentAndReviewView.render(data, prodName);
    navigateTo("commentAndReviewView");
});

//==========================CART NAVIGATION===================================
cartView.addEventListener('goToCheckout', async function (evt) {
    const orderList = evt.cartList;
    const totalSum = evt.detail;
    const shipData = await api.getShipMethods()
    checkoutView.render(shipData, orderList, totalSum);
    navigateTo("checkoutView");
});

//==========================CHECKOUT NAVIGATION===================================
checkoutView.addEventListener('sendOrder', async function (evt) {
    const orderObj = evt.orderForm;
    const result = await api.sendOrder(orderObj);
    const shipData = await api.getShipMethods();
    if (result) {
        orderConfirmationView.render(result, shipData);
        navigateTo("orderConfirmationView");
        showMessage("Order recived!");
    }
});

//==========================CREATE USER NAVIGATION===================================
createUserView.addEventListener('addUser', async function (evt) {
    const form = evt.userForm;
    const result = await api.addUser(form)
    if (result) {
        showMessage("Account created!");
        navigateTo("catView");
    }
});

//==========================LOGIN USER NAVIGATION===================================
loginUserView.addEventListener('loginUser', async function (evt) {
    const username = evt.detail.username;
    const password = evt.detail.password;
    const result = await api.userLogin(username, password);
    if (!result) {
        return
    }
    const categories = await api.getCategories();
    categoryView.render(categories);
    navigateTo("catView");
    showMessage("Login successful");
});

//==========================USER SETTINGS==========================================
userSettingView.addEventListener('logOut', async function (evt) {
    const categories = await api.getCategories();
    categoryView.render(categories);
    navigateTo("catView");
    showMessage("You are now logged out");
});

//-----------------------------------------------------------------------
userSettingView.addEventListener('goToChangeUser', evt => {
    changeUserView.render();
    navigateTo("changeUserView");
});

//-----------------------------------------------------------------------
userSettingView.addEventListener('deleteMeUser', async function (evt) {
    const result = await api.userDeleteMe();
    if (result) {
        const categories = await api.getCategories();
        categoryView.render(categories);
        navigateTo("catView");
        showMessage("Your account is deleted");
    }
});

//-----------------------------------------------------------------------
userSettingView.addEventListener('goToOrderUser', async function (evt) {
    const data = await api.getAllOrderes();
    orderUserView.render(data);
    navigateTo("orderUserView");
});

//-----------------------------------------------------------------------
userSettingView.addEventListener('goToReviewsUser', async function (evt) {
    const data = await api.getAllReviewsUser();
    const productData = await api.getAllProducts();
    userDeleteReview.render(data, productData);
    navigateTo("userDeleteReview");
});

//==========================REVIEWS USER===================================

userDeleteReview.addEventListener('deleteReviewUser', async function (evt) {
    const commentId = evt.detail;
    const result = await api.deleteReview(commentId);
    if (result) {
        showMessage("Review deleted");
    }
});

//==========================ORDER USER===================================
orderUserView.addEventListener('goToOrderDetail', async function (evt) {
    const order = evt.detail;
    const shipData = await api.getShipMethods();
    orderDetailUserView.render(order, shipData);
    navigateTo("orderDetailUserView");
});

//==========================CHANGE USER===================================
changeUserView.addEventListener('changeUser', async function (evt) {
    const form = evt.userForm;
    const result = await api.changeUser(form);
    if (result) {
        const userId = evt.detail;
        const data = await api.getUser(userId);
        userSettingView.render(data);
        navigateTo("userSettingView");
        showMessage("User information changed");
    }
});

//==========================MESSAGE VIEW===================================
messageBoardView.addEventListener('goToMakePost', evt => {
    addPostView.render();
    navigateTo("addPostView");
});

//-----------------------------------------------------------------------
messageBoardView.addEventListener('goToYourPosts', async function (evt) {
    const data = await api.getOwnPosts();
    ownMessagePostDeleteView.render(data);
    navigateTo("ownMessagePostDeleteView");
});

//-----------------------------------------------------------------------
messageBoardView.addEventListener(`goToDetailPost`, async function (evt) {
    const thread = evt.detail;
    const userData = await api.getAllUsers();
    const data = await api.getPost(thread);
    detailMessageBoardView.render(data, userData);
    navigateTo("detailMessageBoardView");
});

//==========================MAKE POST VIEW===================================
addPostView.addEventListener('makeNewPost', async function (evt) {
    const post = evt.postForm;
    const result = await api.makeNewPost(post);
    if (result) {
        const data = await api.showAllPosts();
        messageBoardView.render(data)
        navigateTo("messageBoardView");
        showMessage("Post made")
    }
});

//==========================OWN POST VIEW===================================
ownMessagePostDeleteView.addEventListener('deleteMainPost', async function (evt) {
    const postId = evt.detail;
    const result = await api.deleteMessagePost(postId);
    if (result) {
        showMessage("Your main post is deleted");
    }
});

//==========================DETAIL MESSAGE VIEW===================================
detailMessageBoardView.addEventListener('commentPost', async function (evt) {
    const comment = evt.commentForm;
    const thread = evt.detail;
    const result = await api.commentPost(comment, thread);
    if (result) {
        showMessage("Comment created");
        const data = await api.getPost(thread);
        const userData = await api.getAllUsers();
        detailMessageBoardView.render(data, userData);
        navigateTo("detailMessageBoardView");
    }
});

//-----------------------------------------------------------------------
detailMessageBoardView.addEventListener('rateUserBeenz', async function (evt) {
    const rating = evt.reviewForm;
    const thread = evt.detail;
    const result = await api.rateUser(rating);
    if (result) {
        const data = await api.getPost(thread);
        const userData = await api.getAllUsers();
        detailMessageBoardView.render(data, userData);
        navigateTo("detailMessageBoardView");
        showMessage("Rating done")
    }
});

//-----------------------------------------------------------------------
detailMessageBoardView.addEventListener('deleteCommentPost', async function (evt) {
    const postId = evt.detail;
    const result = await api.deleteMessagePost(postId);
    if (result) {
        showMessage("Comment deleted");
    }
});

//==========================GENERAL NAVIGATION HEADER==========================
container.addEventListener('goToCart', evt => {
    cartView.render();
    navigateTo("cartView")
});

//-----------------------------------------------------------------------
container.addEventListener('goHome', async function (evt) {
    const categories = await api.getCategories();
    categoryView.render(categories);
    navigateTo("catView")
});

//-----------------------------------------------------------------------
container.addEventListener('goBackToProductList', evt => {
    navigateTo("prodView")
});

//-----------------------------------------------------------------------
container.addEventListener('goBackToDetail', evt => {
    navigateTo("detailView")
});

//-----------------------------------------------------------------------
container.addEventListener('goBackSettings', evt => {
    navigateTo("userSettingView");
});

//-----------------------------------------------------------------------
container.addEventListener('goBackOrderList', evt => {
    navigateTo("orderUserView");
});

//-----------------------------------------------------------------------
container.addEventListener('goToCreateUser', evt => {
    createUserView.render();
    navigateTo("createUserView");
});

//-----------------------------------------------------------------------
container.addEventListener('goToLoginUser', evt => {
    loginUserView.render();
    navigateTo("loginUserView");
});

//-----------------------------------------------------------------------
container.addEventListener('goBackToMessage', async function (evt) {
    const data = await api.showAllPosts();
    messageBoardView.render(data)
    navigateTo("messageBoardView");
});

//-----------------------------------------------------------------------
container.addEventListener('goToUserSettings', async function (evt) {
    const userId = evt.detail;
    const data = await api.getUser(userId);
    userSettingView.render(data);
    navigateTo("userSettingView");
});

//----------------------------------------------------------------------- 
container.addEventListener('goToMessage', async function (evt) {
    const data = await api.showAllPosts();
    messageBoardView.render(data)
    navigateTo("messageBoardView");
});


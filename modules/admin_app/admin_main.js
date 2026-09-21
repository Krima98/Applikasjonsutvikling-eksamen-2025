import { AdminLogin } from "./views/login_view.js";
import { AdminHomeView } from "./views/home_view.js";
import { ProductsAdmin } from "./views/product_admin_view.js"
import { DetailAdminView } from "./views/product_detail_admin_view.js";
import { AddProductView } from "./views/add_product.js";
import { ChangeProductView } from "./views/change_prod_view.js";
import { OrdersAdmin } from "./views/order_admin_view.js";
import { UserAdminView } from "./views/user_admin_view.js";
import { CommentsAndReviewMenuView } from "./views/comments_and_review_menu_view.js";
import { CommentsViewAdmin } from "./views/comments_all_view_admin.js";
import { CommentDetailAdminView } from "./views/comment_detail_admin_view.js";
import { ReviewAdminView } from "./views/reviews_admin_view.js";
import * as api from "../api_service.js";
import { showMessage } from "../msg_handler.js";

//-----------------------------------------------------------------------
const loginView = new AdminLogin();
const homeView = new AdminHomeView();
const productAdminView = new ProductsAdmin();
const detailAdminView = new DetailAdminView();
const addProductView = new AddProductView();
const changeProductView = new ChangeProductView();
const userAdminView = new UserAdminView();
const commentsAndReviewMenuView = new CommentsAndReviewMenuView();
const commentsViewAdmin = new CommentsViewAdmin();
const commentDetailAdminView = new CommentDetailAdminView();
const reviewAdminView = new ReviewAdminView();
const orderAdminView = new OrdersAdmin();

//-----------------------------------------------------------------------
const container = document.getElementById("container");
//-----------------------------------------------------------------------
const viewMap = {
    "loginView": loginView,
    "homeView": homeView,
    "productsView": productAdminView,
    "detailAdminView": detailAdminView,
    "addProductView": addProductView,
    "changeProductView": changeProductView,
    "orderAdminView": orderAdminView,
    "userAdminView": userAdminView,
    "commentsAndReviewMenuView": commentsAndReviewMenuView,
    "commentsViewAdmin": commentsViewAdmin,
    "commentDetailAdminView": commentDetailAdminView,
    "reviewAdminView": reviewAdminView
}

//-----------------------------------------------------------------------
function navigateTo(view) {
    container.innerHTML = "";
    container.appendChild(viewMap[view]);
}
//-----------------------------------------------------------------------

//start
loginView.render()
navigateTo("loginView");

//==========================LOGIN===================================
loginView.addEventListener('loginAdmin', async function (evt) {
    const username = evt.detail.username;
    const password = evt.detail.password;
    const result = await api.admingLogin(username, password);
    if (result) {
        homeView.render(result);
        navigateTo("homeView");
    }
});

//==========================HOME VIEW NAVIGATION===================================
homeView.addEventListener('productViewAdmin', async function (evt) {
    const data = await api.getAllProducts()
    productAdminView.render(data);
    navigateTo("productsView");
});

//-----------------------------------------------------------------------
homeView.addEventListener('orderViewAdmin', async function (evt) {
    const data = await api.getAllOrderes();
    orderAdminView.render(data);
    navigateTo("orderAdminView");
});

//-----------------------------------------------------------------------
homeView.addEventListener('userViewAdmin', async function (evt) {
    const data = await api.getAllUsers();
    userAdminView.render(data);
    navigateTo("userAdminView");
});

//-----------------------------------------------------------------------
homeView.addEventListener('commentViewAdmin', evt => {
    commentsAndReviewMenuView.render();
    navigateTo("commentsAndReviewMenuView");
});

//==========================PRODUCT VIEW NAVIGATION===================================
productAdminView.addEventListener('goToAddProduct', evt => {
    addProductView.render();
    navigateTo("addProductView");
});

//-----------------------------------------------------------------------
productAdminView.addEventListener('goToDetail', async function (evt) {
    const prodId = evt.detail;
    const data = await api.getProductDetailAdmin(prodId);
    const order = await api.getAllOrderes();
    detailAdminView.render(data, order);
    navigateTo("detailAdminView");
});

//==========================ADD PRODUCT VIEW===================================
addProductView.addEventListener('addProduct', async function (evt) {
    const form = evt.productForm;
    const result = await api.addProduct(form)
    if (result) {
        showMessage("Product added!");
    }
});

//==========================DETAIL PRODUCT VIEW ADMIN===================================
detailAdminView.addEventListener('deleteProd', async function (evt) {
    const prodId = evt.detail;
    const result = await api.deleteProduct(prodId);
    if (result) {
        showMessage("Product is deleted");
        const data = await api.getAllProducts();
        productAdminView.render(data);
        navigateTo("productsView");
    }
});

//-----------------------------------------------------------------------
detailAdminView.addEventListener('goToChangeProd', async function (evt) {
    const prodId = evt.detail;
    const data = await api.getProductDetailAdmin(prodId);
    changeProductView.render(data);
    navigateTo("changeProductView");
});

//==========================CHANGE PRODUCT VIEW ADMIN===================================
changeProductView.addEventListener('changeProduct', async function (evt) {
    const prodId = evt.detail;
    const form = evt.productForm;
    const result = await api.changeProduct(form, prodId);
    if (result) {
        const data = await api.getProductDetailAdmin(prodId);
        const order = await api.getAllOrderes();
        detailAdminView.render(data, order);
        navigateTo("detailAdminView");
        showMessage("Product is changed!");
    }
});

//==========================USER VIEW NAVIGATION===================================
userAdminView.addEventListener('deleteUser', async function (evt) {
    const userId = evt.detail;
    const result = await api.deleteUserAdmin(userId);
    if (result) {
        showMessage("User deleted");
    }
});

//-----------------------------------------------------------------------
userAdminView.addEventListener('deleteAllBeenz', async function (evt) {
    const result = await api.deleteBeenz();
    if (result) {
        const data = await api.getAllUsers();
        userAdminView.render(data);
        navigateTo("userAdminView");
        showMessage("All user rating is deleted");
    }
});

//==========================ORDER VIEW NAVIGATION===================================
orderAdminView.addEventListener('deleteOrder', async function (evt) {
    const orderId = evt.detail;
    const result = await api.deleteOrder(orderId);
    if (result) {
        showMessage("Order is deleted");
    }
});

//==========================COMMENTS/REVIEW MENU VIEW ADMIN===================================
commentsAndReviewMenuView.addEventListener('goToCommentsView', async function (evt) {
    const data = await api.showAllPosts();
    commentsViewAdmin.render(data);
    navigateTo("commentsViewAdmin");
});

//-----------------------------------------------------------------------
commentsAndReviewMenuView.addEventListener('goReviewView', async function (evt) {
    const userData = await api.getAllUsers();
    const productData = await api.getAllProducts();
    const data = await api.getAllReviews();
    reviewAdminView.render(data, productData, userData);
    navigateTo("reviewAdminView");
});

//==========================REVIEW VIEW ADMIN===================================
reviewAdminView.addEventListener('deleteReviewAdmin', async function (evt) {
    const commentId = evt.detail;
    const result = await api.deleteReview(commentId);
    if (result) {
        showMessage("Review deleted");
    }
});

//==========================COMMENTS/MESSAGE VIEW ADMIN (ALL MAIN POSTS)===================================
commentsViewAdmin.addEventListener('goDetailCommentView', async function (evt) {
    const thread = evt.detail;
    const userData = await api.getAllUsers();
    const data = await api.getPost(thread);

    commentDetailAdminView.render(data, userData);
    navigateTo("commentDetailAdminView");
});

//==========================DETAIL MESSAGE VIEW ADMIN===================================
commentDetailAdminView.addEventListener('deleteMainPost', async function (evt) {
    const mainPostId = evt.detail;
    const result = await api.deleteMessagePost(mainPostId);
    if (result) {
        const data = await api.showAllPosts();
        commentsViewAdmin.render(data);
        navigateTo("commentsViewAdmin");
        showMessage("Main post deleted!");
    }
});

//-----------------------------------------------------------------------
commentDetailAdminView.addEventListener('deleteComment', async function (evt) {
    const postId = evt.detail;
    const result = await api.deleteMessagePost(postId);
    if (result) {
        showMessage("Comment deleted!");
    }
});

//==========================GENERAL HEADER NAVIGATION===================================
container.addEventListener('goHome', evt => {
    navigateTo("homeView");
});

//-----------------------------------------------------------------------
container.addEventListener('goBackDetail', evt => {
    navigateTo("detailAdminView");
});

//-----------------------------------------------------------------------
container.addEventListener('goBackToAllPost', evt => {
    navigateTo("commentsViewAdmin");
});

//-----------------------------------------------------------------------
container.addEventListener('goBackToCommentsAndReview', evt => {
    navigateTo("commentsAndReviewMenuView");
});

//-----------------------------------------------------------------------
container.addEventListener('goBackProducts', async function (evt) {
    const data = await api.getAllProducts();
    productAdminView.render(data);
    navigateTo("productsView");
});






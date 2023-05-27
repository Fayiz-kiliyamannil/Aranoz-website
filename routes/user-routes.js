
const express = require("express");
const route = express();
const nocache = require('nocache')
const userControllers = require("../controllers/userControllers");
const productController = require('../controllers/productControllers');
const cartController= require('../controllers/cartControllers')
const wishlistController = require('../controllers/wishlistControllers');
const couponController = require("../controllers/couponControllers");
const orderController = require('../controllers/orderControllers')
const auth = require("../middleware/userAuth")
const bodyParser = require("body-parser");
route.use(express.json());
route.use(bodyParser.urlencoded({ extended: true }));
route.use(nocache());

route.get("/",userControllers.loadpage);
route.get("/login",userControllers.loadlogin);
route.post("/home",userControllers.loadUserSignin);
route.post("/otp",userControllers.insertuser);
route.get("/otp",userControllers.otpinsertuser);
route.get('/signup',userControllers.loadsignup);
route.post('/login',userControllers.varifyotp);
route.get('/logout',userControllers.userlogout);
route.get('/shop',productController.loadShop);
route.get('/profile',userControllers.loadProfile);
route.post('/profile',userControllers.insertUserAddress);
route.get('/editAddress',userControllers.editAdress);
route.post('/profileEdit',userControllers.updateEditAddress);
route.get('/cart',auth.islogin,cartController.loadCart);
route.get("/addtocart",cartController.loadAddToCart);
route.post("/updateQuantity",auth.islogin,cartController.loadUpdateQuantity);
route.get("/remove",userControllers.removeProduct);
route.get('/productDetails',productController.loadProductDetails);
route.get('/wishlist',auth.islogin,wishlistController.loadWishList);
route.get('/addWishlist',wishlistController.addToWishlist);
route.get('/wishlistRemove',wishlistController.removeWishlist);
route.post("/coupon",auth.islogin,couponController.userTryCoupon);
route.get('/removecoupon',couponController.removeUserTryCoupon)
route.get("/checkout",auth.islogin,userControllers.loadCheckout);
route.post('/varify-payment',userControllers.varifyPayment);
route.post('/delivery',auth.islogin,userControllers.loadDelivery);
route.get('/orderDetails',auth.islogin,orderController.loadOrderDetails);
route.get ('/orderDetailsHistory',auth.islogin,orderController.orderDetailsHistory)
route.get('/walletHistory',userControllers.loadWalletHistory);
route.get('/delivery',orderController.successDelivery);  
// route.get('/category',userControllers.loadCategory);
route.get('/cancelorder',userControllers.loadCancelOrder);
route.get('/returnorder',userControllers.loadReturnOrder);
// route.get('/*',userControllers.loadUniversal)
// route.get('admin/*',userControllers.loadUniversal)
module.exports=route;


 
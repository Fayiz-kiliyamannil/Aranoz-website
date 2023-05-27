const express = require('express');
const adminroute = express(); 
const admincontoller = require ('../controllers/adminConrollers')
const bodyParser = require("body-parser");
adminroute.use(express.json());
adminroute.use(bodyParser.urlencoded({ extended: true }));
const path = require('path');
const confic = require('../confic/userConfic')
const auth = require("../middleware/adminAuth");
 const nocache = require('nocache');
  adminroute.use(nocache());
  const photoadd = require('../middleware/multer');
const adminModels = require('../models/adminModels');
const  excelController =require('../controllers/excelControllers');
  
adminroute.get('/',auth.isLogout,admincontoller.loadlogin);
adminroute.get('/adhome',auth.isLogin,admincontoller.loadadhome);
adminroute.post('/adhome',admincontoller.adminlogin)
adminroute.get('/user',auth.isLogin,admincontoller.loadusers); 
adminroute.get('/block',admincontoller.userblock) 
adminroute.get('/unblock',admincontoller.userunblock)
adminroute.get('/logout',auth.isLogin,admincontoller.adminlogout);
adminroute.get('/category',auth.isLogin,admincontoller.loadcategory);
adminroute.post('/category',admincontoller.addcategory);
adminroute.get("/unlist",admincontoller.categoryunlist);
adminroute.get('/list',admincontoller.categorylist);
adminroute.get('/products',auth.isLogin,admincontoller.loadproduct);
adminroute.get('/productsview',auth.isLogin,admincontoller.loadProductsview);
adminroute.post('/products',photoadd.array('image'),admincontoller.addproducts);
adminroute.get("/productEdit" ,auth.isLogin ,admincontoller.loadEditProducts);
adminroute.post("/updateProduct",photoadd.array('image'),admincontoller.loadUpdateProduct)
adminroute.get('/productunlist' ,auth.isLogin ,admincontoller.productunlist);
adminroute.get('/productlist' ,auth.isLogin ,admincontoller.productlist);
adminroute.get('/coupon' ,auth.isLogin ,admincontoller.loadcoupon);
adminroute.post('/addcoupon',admincontoller.addcoupon);
adminroute.get('/addcoupon' ,auth.isLogin ,admincontoller.loadaddcoupon);
adminroute.get ('/order' ,auth.isLogin ,admincontoller.loadOrder);
adminroute.get('/orderDetails' ,auth.isLogin ,admincontoller.loadOrderDetails);
adminroute.get('/bannerView' ,auth.isLogin ,admincontoller.loadBannerView);
adminroute.get('/banner' ,auth.isLogin ,admincontoller.loadBanner);
adminroute.post('/addbanner', photoadd.array('image') ,admincontoller.loadAddBanner)
adminroute.get ('/bannerlist' ,auth.isLogin ,admincontoller.bannerList);
adminroute.get('/bannerunlist' ,auth.isLogin ,admincontoller.bannerUnlist);  
adminroute.get('/bannerdelete' ,auth.isLogin ,admincontoller.bannerDelete);
adminroute.get('/orderdelivered' ,auth.isLogin ,admincontoller.loadOrderDelivered);
adminroute.get('/returnconformation' ,auth.isLogin ,admincontoller.loadReturnConformation);
adminroute.get('/refundcomplete',auth.isLogin ,admincontoller.loadRefundCompleted);
adminroute.get('/downloadexcel',auth.isLogin,excelController.downloadExcel)


module.exports = adminroute;  
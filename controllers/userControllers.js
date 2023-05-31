const registration = require("../models/modeView");
const adproducts = require("../models/modelproduct");
const adaddress = require("../models/modelUserAddress");
const bcrypt = require("bcrypt");
const nodeMailer = require("nodemailer");
const session = require("express-session");
const adCart = require("../models/modelCart")
const adWishlist = require("../models/modelWishlist");
const adorder = require("../models/modelUserOrder");
const adcoupon = require("../models/modelCoupon");
const { insertMany } = require("../models/modelCategory");
const adcategory = require('../models/modelCategory')
const adbanner = require('../models/modelBanner')
const Razorpay = require('razorpay')
const { ObjectId } = require("mongodb")

var instance = new Razorpay({
  key_id: process.env.razorpayKey,
  key_secret: process.env.razorpayKey_secret,
});

let userName;

const securepassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};
//HERE THE PAGE FOR MAIL SEND
let otp;
const sendVarifyMail = async (name, email, registration_id) => {
  try {
    otp = Math.random();
    otp = otp * 1000000;
    otp = parseInt(otp);
    console.log(otp);
    const transporter = nodeMailer.createTransport({
      host: "smpt.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      service: "Gmail",
      auth: {
        user: "aranoz560@gmail.com",
        pass: "rkgofwozptrhroah",
      },
    });
    const mailOptions = {
      from: "aranoz560@gmail.com",
      to: data.email,
      subject: "for varification mail",
      html:
        "<h3>OTP for account verification is </h3>" +
        "<h1 style='font-weight:bold;'>" +
        otp +
        "</h1>",
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

// HOME PAGE PRODUCT ADDED
const loadpage = async (req, res) => {
  try {
    const page = req.query.page;
    const perPage = 8;
    const showProducts = await adproducts.find({}).lean().skip((page - 1) * perPage).limit(perPage);
    const banner = await adbanner.find({}).lean()
    res.render("user/home", {
      users: true,
      userName,
      usershead: true,
      product: showProducts,
      banner
    });
  } catch (error) {
    console.log(error.message);
  }
};

//   HERE THE PAGE RENDER TO USER LOGIN
const loadlogin = async (req, res) => {
  try {
    res.render("user/login", { users: true });
  } catch (error) {
    console.log(error.message);
  }
};

//  HERE THE PAGE RENDER TO USER SIGNUP
const loadsignup = async (req, res) => {
  try {
    res.render("user/signup", { users: true });
  } catch (error) {
    console.log(error.message);
  }
};

// INSERT USER DETAILS TO DATABASE
let data;
const insertuser = async (req, res) => {
  try {
    const passwordDB = await securepassword(req.body.password);
    const { name, email, password, phone } = req.body;


    const emailDB = req.session.email
    req.session.email = email;
    req.session.name = name
    req.session.phone = phone
    req.session.password = req.body.password
    const userData = await registration.findOne({ email: emailDB })

    if (userData === null) {
      data = new registration({
        name,
        email,
        password: passwordDB,
        phone,
        is_admin: 0,
      });


      if (data) {
        console.log(data);
        sendVarifyMail(req.body.name, req.body.email);
        res.render("user/otp", { otp: true });
      } else {
        res.render("user/signup", {
          message: "please fill the form",
          users: true,
        });
      }
    } else {
      res.render("user/login", {
        message: "You are already registered. Please log in.",
        users: true,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};
// HERE THE PAGE RESEND OTP
const otpinsertuser = async (req, res) => {
  try {
    const password = await securepassword(req.session.password);
    console.log(password + "-----------------------------------");
    const emailDB = req.session.email
    const nameDB = req.session.name;
    const phoneDB = req.session.phone;
    data = new registration({
      name: nameDB,
      phone: phoneDB,
      password: password,
      email: emailDB,
      is_admin: 0,

    });
    console.log("data============== " + data);
    sendVarifyMail(emailDB, nameDB);
    res.render('user/otp', { otp: true })
  } catch (error) {
    console.log("error in otpinssertuser " + error.message);
    res.render('user/404')
  }
}


const varifyotp = async (req, res) => {
  try {
    const { first, second, third, fourth, fifth, sixth } = req.body;
    const userotp = Number(first + second + third + fourth + fifth + sixth);
    console.log(userotp + "---------");
    if (userotp == otp) {
      const userdata = await data.save();

      if (userdata) {
        res.render("user/login", {
          message: "your varification is successfully completed",
          users: true,
        });
      }
    } else {
      res.render("user/otp", { message: "invalied otp", otp: true });
    }
  } catch (error) {
    console.log("otp varification error" + error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
//  SIGNIN PAGE--TO CHECK THE USER GMAIL AND PASSWORD AND RENDER TO HOME  PAGE
const loadUserSignin = async (req, res) => {
  try {
    const emailDB = req.body.email;
    const password = req.body.password;
    const varifyData = await registration.findOne({ email: emailDB });
    if (varifyData) {
      const userPassword = await bcrypt.compare(password, varifyData.password);
      if (userPassword) {
        if (varifyData.is_admin == 0) {
          req.session.user = varifyData.name;
          req.session.userid = varifyData._id;
          req.session.email = varifyData.email;
          userName = req.session.user;
          console.log(userName + "---------------");

          res.render("user/home", { users: true, userName, usershead: true });
        } else {
          res.render("user/login", {
            message: " Your Account is blocked",
            users: true,
          });
        }
      } else {
        res.render("user/login", {
          message: "email or password is incorrect",
          users: true,
        });
      }
    } else {
      res.render("user/login", {
        message: "The Email address you entered is not registered",
        users: true,
      });
    }
  } catch (error) {
    console.log("load user signin" + error.message);
    res.status(500).json({ message: "internal server error" });
  }
};


// //=================HERE THE PAGE SHOW THE PRODCTS WITH  SPECIFIC CATEGORY====================
// const loadCategory = async(req,res)=>{
//   try {
//     const name = req.query.name;
//     const showProducts = await adproducts.find({category:name}).lean()
//     const category =  await adcategory.find({}).lean()
//     res.render("user/shop", {
//       users: true,
//       usershead: true,
//       product: showProducts,
//       userName,
//       category
//     });
//   } catch (error) {
//     console.log("error loadCategory ",error.message);
//   }
// }

//HERE THE PAGE USER PROFILE WILL RENDER
const loadProfile = async (req, res) => {
  try {
    userName = req.session.user;
    console.log(userName);
    const userid = req.session.userid;
    console.log(userid + "----------------------------");
    const userData = await registration.findOne({ _id: userid })
    const showAddress = await adaddress.find({ id: userid }).lean();
    res.render("user/profile", {
      users: true,
      userName,
      usershead: true,
      address: showAddress,
      userData
    });
  } catch (error) {
    console.log("error loadprofile " + error.message);
  }
};

//===============================HERE THE PAGE ADD USER ADDRESS==================================================
const insertUserAddress = async (req, res) => {
  try {
    const addressData = new adaddress({
      id: req.session.userid,
      name: req.body.name,
      surname: req.body.surname,
      phone: req.body.phone,
      address: req.body.address,
      district: req.body.district,
      pincode: req.body.pincode,
      state: req.body.state,
      area: req.body.area,
      country: req.body.country,
    });
    const addressSave = await addressData.save();

    console.log(addressSave);

    res.redirect("/profile");
  } catch (error) {
    console.log("error loadprofile " + error.message);
  }
};

//HERE THE PAGE EDIT ADDRESS RENDER TO EDITADDRESS....
const editAdress = async (req, res) => {
  try {
    const id = req.query.id;
    const addressData = await adaddress.findById({ _id: id });
    res.render("user/editAddress", {
      users: true,
      id: addressData._id,
      name: addressData.name,
      surname: addressData.surname,
      phone: addressData.phone,
      address: addressData.address,
      pincode: addressData.pincode,
      state: addressData.state,
      area: addressData.area,
      country: addressData.country,
    });
  } catch (error) {
    console.log("error editAdress" + error.message);
  }
};

//HERE THE PAGE UPDATE THE USER ADRESS AND REDIREDCT TO PROFILE
const updateEditAddress = async (req, res) => {
  try {
    console.log(req.body.id);
    const addressData = await adaddress.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          name: req.body.name,
          surname: req.body.surname,
          pincode: req.body.pincode,
          phone: req.body.phone,
          address: req.body.address,
          pincode: req.body.pincode,
          state: req.body.state,
          area: req.body.area,
          country: req.body.country,
        },
      }
    );
    res.redirect("/profile");
  } catch (error) {
    console.log("error updateEditAdress " + error.message);
  }
};



//HERE THE METHOD REMOVE THE PRODUCT FROM THE CART 
const removeProduct = async (req, res) => {
  try {
    const productId = req.query.id;
    const userId = req.session.userid;

    await adCart.findOneAndUpdate(
      { userId: userId },
      { $pull: { products: { productId: productId } } }
    );
    res.json({ message: "success" })

  } catch (error) {
    console.log("error removeProduct " + error.message);
  }
}




//===================================HERE THE PAGE RENDER TO CHECKOUT DETAILS ================================
const loadCheckout = async (req, res) => {
  try {
    const email = req.session.email;
    const userId = req.session.userid;
    const userName = req.session.user;
    const cartList = await adCart.find({ userId: userId }).populate("products.productId").lean();
    const showAddress = await adaddress.find({ id: userId }).lean();
    if (req.session.coupon) {
    } else {
      req.session.coupon = 0;
    }
    const [{ products }] = cartList;

    const checkOutQuantityPriceData = products.map(({ productId, quantity, totalPrice, }) => ({
      name: productId.name,
      totalPrice,
      quantity,

    }))

    const subTotal = checkOutQuantityPriceData.reduce((total, num) => total + num.totalPrice, 0)
    req.session.subTotal = subTotal;//=============================totalprice of user ordered products
    let grandtotal;
    const couponDiscount = await adcoupon.findOne({ couponCode: req.session.coupon })
    let discountValue = 0;
    if (couponDiscount) {
      discountValue = couponDiscount.discountValue;
      grandtotal = subTotal - discountValue

    } else {
      grandtotal = subTotal;
    }
    if (grandtotal <= 0 ){
      grandtotal = 0 ;
    }

    req.session.grandtotal = grandtotal;

    const couponError = req.session.couponError;

  
    res.render('user/checkout', {
      users: true, usershead: true, checkOutQuantityPriceData,
      userName, subTotal, grandtotal, discountValue, couponError, showAddress, userName, email, coupon: req.session.coupon,
    })
  } catch (error) {
    console.log("loadCheckout error " + error.message);
  }
}

const loadDelivery = async (req, res) => {
  try {
    let status = "Order Processing"
    let delivery = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: String(req.body.address),
      district: req.body.district,
      state: req.body.state,
      area: req.body.area,
      pincode: req.body.pincode,
      country: req.body.country
    }
    const paymentMethod = req.body.selector || req.body.coupon;
    console.log('paymentMethod---------------',paymentMethod);
    const grandtotal = req.session.grandtotal;
    const userId = req.session.userid;
    const currentDate = new Date();
    const orderdate = currentDate.toISOString().split('T')[0];
   // const deliverydate = new Date(deldt.setDate(deldt.getDate() + 7))
    // deliverydate = deliverydate.toLocaleString()
    status = status;
    returnstatus = true
    product = req.session.cartDataList;
    await adorder.insertMany([{ userId: userId, deliveryaddress: delivery, grandtotal: grandtotal, product: product, orderdate: orderdate, paymentmethod: paymentMethod, status: status, returnstatus: returnstatus }]);
    const cartData = await adCart.findOne({ userId: userId });
    const products = cartData.products;
    
    if (paymentMethod == 'cod') {
      await adCart.deleteOne({ userId: userId })
      const orderdetails = await adorder.findOne({ userId: userId }).sort({ $natural: -1 })
      const orderId = orderdetails._id
      const total = orderdetails.grandtotal;
      await adorder.findOneAndUpdate({ _id: orderId }, { $set: { status: "success" } });
      for (i = 0; i < products.length; i++) {
        const productId = products[i].productId;
        const quantity = products[i].quantity;
        await adproducts.findByIdAndUpdate(productId, { $inc: { stock: -quantity } })
      }
      res.json({ codSuccess: true })

    } else if (paymentMethod == 'online') {

      console.log("heloo its online");
      var options = {
        amount: grandtotal,  // amount in the smallest currency unit
        currency: "INR",
        receipt: ""
      };
      instance.orders.create(options, function (err, order) {
        if (err) {
          console.log(err);
        } else {
          res.json({ status: true, order: order });
          console.log(order)
        }
      });
    } else if(paymentMethod == 'coupon'){
      await adCart.deleteOne({ userId: userId })
      const orderdetails = await adorder.findOne({ userId: userId }).sort({ $natural: -1 })
      const orderId = orderdetails._id
      const total = orderdetails.grandtotal;
      await adorder.findOneAndUpdate({ _id: orderId }, { $set: { status: "success" } });
      for (i = 0; i < products.length; i++) {
        const productId = products[i].productId;
        const quantity = products[i].quantity;
        await adproducts.findByIdAndUpdate(productId, { $inc: { stock: -quantity } })
      }
      res.json({ codSuccess: true })
     
    }

     else if (paymentMethod == 'wallet') {
      const userData = await registration.findOne({ _id: userId });
      const wallet = userData.wallet;
      const orderdetails = await adorder.findOne({ userId: userId }).sort({ $natural: -1 })
      const orderId = orderdetails._id
      const total = orderdetails.grandtotal;

      if(wallet >= total){
        await registration.updateOne({ _id: userId },{$inc:{wallet:-total}})
        await registration.findOneAndUpdate({_id:userId},{$push:{walletHistory:{debit:total,date:orderdate}}});
        await adorder.findOneAndUpdate({ _id: orderId }, { $set: { status: "success" } });
        for (i = 0; i < products.length; i++) {
          const productId = products[i].productId;
          const quantity = products[i].quantity;
          await adproducts.findByIdAndUpdate(productId, { $inc: { stock: -quantity } })
          await adCart.deleteOne({ userId: userId })
        }
        res.json({ walletSuccess: true })

      }else{
        console.log("wallet balance is  low-----------");
        // lowWallet:"Insufficient balance in wallet"
        
        res.json({ walletLow: true })
           
      }
    }
  } catch (error) {
    console.log("error in loadDelivery " + error.message);
  }
}
//-------here the page render the wallet history-----------
const loadWalletHistory = async (req,res)=>{
  try {
    const userName = req.session.user;
    const userId = req.session.userid;
    const walletHistory = await registration.findOne({_id:userId});
    res.render('user/walletHistory',{users:true,usershead:true ,walletHistory,userName});
  } catch (error) {
    console.log("error in loadWalletHistory ",error.message);
  }
}

// --------------HERE THE VARIFY THE ONLINE PAYMENT AND STOCK MANAGEMENT----------------
const varifyPayment = async (req, res) => {
  try {
    const userId = req.session.userid
    const order = req.body.payment
    const cartData = await adCart.findOne({ userId: userId });
    const products = cartData.products;

    await adCart.deleteOne({ userId: userId })
    const orderdetails = await adorder.findOne({ userId: userId }).sort({ $natural: -1 })
    const orderId = orderdetails._id
    await adorder.findOneAndUpdate({ _id: orderId }, { $set: { status: "success" } });
    for (i = 0; i < products.length; i++) { //  STOCK MANAGEMENT DECREASE THE PRODUCT QUANDITY AFTER USER PURCHASE
      const productId = products[i].productId;
      console.log("productId----", productId);
      const quantity = products[i].quantity;
      console.log("quantity---", quantity);
      await adproducts.findByIdAndUpdate(productId, { $inc: { stock: -quantity } })
    }
    res.json({ status: true })
  } catch (error) {
    console.log("error varifypayment " + error.message)
  }
}
//====================HERE THE PAGE USER CAN CANCEL THE ORDER==================
const loadCancelOrder = async (req, res) => {
  try {
    const id = req.query.orderId;
    const orderData = await adorder.findOne({ _id: id });
    const products = orderData.product;
    const userId = orderData.userId;
    const payment = orderData.paymentmethod;
    const currentDate = new Date();
    const creditdate = currentDate.toISOString().split('T')[0];
    for (i = 0; i < products.length; i++) {
      const productId = products[i]._id;
      const quantity = products[i].quantity;
      await adproducts.findByIdAndUpdate(productId, { $inc: { stock: quantity } })
    }
    if (payment === 'online') {
      const totalPurchasePrice = orderData.grandtotal;
      await registration.updateOne({ _id: userId }, { $inc: { wallet: totalPurchasePrice } });
      await registration.findOneAndUpdate({_id:userId},{$push:{walletHistory:{credit:totalPurchasePrice,date:creditdate}}})

    }else if(payment === 'wallet'){
      const totalPurchasePrice = orderData.grandtotal;
      await registration.updateOne({ _id: userId }, { $inc: { wallet: totalPurchasePrice } });
      await registration.findOneAndUpdate({_id:userId},{$push:{walletHistory:{credit:totalPurchasePrice,date:creditdate}}})
     
    }

    await adorder.updateOne({ _id: id }, { $set: { status: 'cancelled' } })
    res.json({ message: 'success' })
  } catch (error) {
    console.log("loadCancelOrder ", error.message);
  }
}

//=====================HERE THE PAGE USER CAN RETURN THE ORDER======================
const loadReturnOrder = async (req, res) => {
  try {
    const id = req.query.orderId;
    await adorder.updateOne({ _id: id }, { $set: { status: 'return request processing' } })
    res.json({ message: 'success' })
  } catch (error) {
    console.log("error loadRetunOrder ", error.message);
  }
}
//========================here the  order return conformation====================






//    HERE THE PAGE DESTROY SESSION AND REDIRECT TO HOME
const userlogout = async (req, res) => {
  try {
    req.session.destroy();
    req.session.userName = 0;
    res.render("user/home", { users: true, usershead: true });
  } catch (error) {
    console.log("error in userlogout " + error.message);
  }
};

const loadUniversal =  async(req,res)=>{
  try {
    res.render('user/404')
  } catch (error) {
    console.log("error loaduniversal "+error.message);

  }
}



module.exports = {
  loadpage,
  loadlogin,
  loadsignup,
  otpinsertuser,
  insertuser,
  varifyotp,
  loadUserSignin,
  userlogout,
  loadProfile,
  insertUserAddress,
  editAdress,
  updateEditAddress,

  removeProduct,
  loadCheckout,
  loadDelivery,
  varifyPayment,
  loadCancelOrder,
  loadReturnOrder,
  loadWalletHistory,

  loadUniversal,
};

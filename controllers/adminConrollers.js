const registration = require("../models/modeView");
const adminegistration = require("../models/adminModels");
const adcategory = require("../models/modelCategory");
const adproducts = require("../models/modelproduct")
const bcrypt = require("bcrypt");
const adcoupon = require('../models/modelCoupon')
const adOrder = require('../models/modelUserOrder')
const varifyotp = require("./userControllers");
const adBanner = require('../models/modelBanner');
const adCart = require('../models/modelCart')

// HERE THE PAGE RENDER TO ADMIN LOGIN PAGE
const loadlogin = async (req, res) => {
  try {
    res.render("admin/login", { admins: true });
  } catch (error) {
    console.log(" error admin loadhome " + error.message);
  }
};

//  HERE THE PAGE RENDER TO ADMIN HOME PAGE 
const loadadhome = async (req, res) => {
  try {
    const to = req.query.to;
    const from = req.query.from;
    const currentDate = new Date();
    const orderDate = currentDate.toISOString().split('T')[0];
  //  const todaySales = await adOrder.find({status:'delivered'});
    const countUsers = await registration.countDocuments({});
    //===================PAYMENT GRAHE===================================================
    const cod = { paymentmethod: 'cod' }
    const cCod = await adOrder.countDocuments(cod);
    const wallet = { paymentmethod: 'wallet' }
    const cWallet = await adOrder.countDocuments(wallet);
    const online = { paymentmethod: 'online' }
    const cOnline = await adOrder.countDocuments(online);
    //==============================================================
    const countDelivered = { status: 'delivered' }
    const cDelivered = await adOrder.countDocuments(countDelivered);
    const countOrder = { status: 'success' }
    const cOrdered = await adOrder.countDocuments(countOrder);
    const countCancel = { status: 'cancelled' }
    const cCancel = await adOrder.countDocuments(countCancel);
    const countReturn = { status: 'return request success' };
    const cReturn = await adOrder.countDocuments(countReturn);
    // =========saleReport
    let query = { status: 'delivered' };

    if (from && to) {
      query.orderdate = {
        $gte: from,
        $lte: to,
      };
    } else if (from) {
      query.orderdate = {
        $gte: from,
      };
    } else if (to) {
      query.orderdate = {
        $lte: to,
      };
    }
    const orderData = await adOrder.find(query).lean();
    const grandTotal = await adOrder.aggregate([
      {
        $group: {
          _id: 0,
          total: { $sum: "$grandtotal" }
        }
      }
    ])

    const totalRevenue = grandTotal.map(item => item.total);
    res.render("admin/home", {
      admins: true, adminshead: true, dash: true, countUsers,
      totalRevenue, cCod, cOnline, cWallet, cCancel, cDelivered, cOrdered, cReturn, orderData,to,from
    });

  } catch (error) {
    console.log("error in loadhome " + error.message);
  }
};

const loadusers = async (req, res) => {
  try {
    const userData = await registration.find({}).lean();
    res.render("admin/user", {
      registration: userData,
      admins: true,
      adminshead: true,
      user: true,
    });
  } catch (error) {
    console.log("error loadussers " + error.message);
  }
};

//LOGIN PAGE -- HERE THE PAGE VARIFY THE GMAIL AND PASSWORD OF ADMIN ----- 
// RENDER TO ADMIN-HOME PAGE ------
// CREATE SESSSION_ID -------
const adminlogin = async (req, res) => {
  try {
    const emailDB = req.body.email;
    const passworDB = req.body.password;
    const varifyData = await adminegistration.findOne({ email: emailDB });
    if (varifyData) {
      const varifyPassword = await bcrypt.compare(
        passworDB,
        varifyData.password
      );
      if (varifyPassword) {
        req.session.adminid = varifyData._id;

        res.redirect("/admin/adhome")
        // res.render("admin/home", { admins: true, adminshead: true, countUsers, totalRevenue,cCod,cOnline,cWallet });
      } else {
        res.render("admin/login", {
          admins: true,
          message: "invalied Email or password",
        });
      }
    } else {
      res.render("admin/login", {
        admins: true,
        message: "invalied Email or password",
      });
    }
  } catch (error) {
    console.log("error adminlogin " + error.message);
  }
};
// HERE THE METHOD BLOCK THE USER_ID
const userblock = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await registration.updateOne(
      { _id: id },
      { $set: { is_admin: 1 } }
    );
    res.redirect("/admin/user");
  } catch (error) {
    console.log("error userblock " + error.message);
  }
};

// HERE THE METHOD  UNBLOCK THE USER_ID
const userunblock = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await registration.updateOne(
      { _id: id },
      { $set: { is_admin: 0 } }
    );
    res.redirect("/admin/user");
  } catch (error) {
    console.log("error userblock " + error.message);
  }
};

// HERE THE METHOD RENDER TO CATEGORY PAGE 
const loadcategory = async (req, res) => {
  try {
    const showCategory = await adcategory.find({}).lean()

    res.render("admin/category", {
      categorys: showCategory,
      category: true,
      admins: true,
      adminshead: true,
    });
  } catch (error) {
    console.log("error loadcategory " + error.message);
  }
};
// HERE THE METHOD IS TO ADD CATEGORY =============
const regex = /^[A-Z]/;
const addcategory = async (req, res) => {
  try {
    const nameDB = req.body.name;
    const variyUniqueName = await adcategory.findOne({ name: nameDB });
    const showCategory = await adcategory.find({}).lean();
    if (variyUniqueName) {
      res.render("admin/category", {
        categorys: showCategory,
        category: true,
        admins: true,
        adminshead: true,
        message: "This category is already exist"
      })
    } else if (regex.test(nameDB)) {

      const categoryData = new adcategory({
        name: req.body.name,
        categoryStatus: 1,
      });
      const data = await categoryData.save();
      res.redirect("/admin/category");
    } else {
      res.render("admin/category", {
        categorys: showCategory,
        category: true,
        admins: true,
        adminshead: true,
        message: "the first letter must be uppercase"
      })
    }
  } catch (error) {
    console.log("error addcategory " + error.message);
  }
};

// HERE  THE  METHEOD UNLIST THE CATEGORY
const categoryunlist = async (req, res) => {
  try {

    const id = req.query.product
    console.log(id);
    const unlist = await adcategory.updateOne({ _id: id }, { $set: { categoryStatus: 0 } })
    res.json({ message: "success" })
    //res.redirect("/admin/category");
  } catch (error) {
    console.log("error categoryunlist " + error.message);
  }
}

//HERE THE METHOD LIST THE CATEGORY
const categorylist = async (req, res) => {
  try {
    const id = req.query.product;
    const unlist = await adcategory.updateOne({ _id: id }, { $set: { categoryStatus: 1 } })
    res.json({ message: 'success' })
    // res.redirect("/admin/category");
  } catch (error) {
    console.log("error categoryunlist " + error.message);
  }
}

// HERE THE PAGE RENDER TO PRODUCTS PAGE
const loadproduct = async (req, res) => {
  try {
    const showCategory = await adcategory.find({}).lean()

    res.render("admin/products", {
      categorys: showCategory, product: true, admins: true,
      adminshead: true,
    });
  } catch (error) {
    console.log("error loadproducts " + error.message);
  }
}

// HERE THE METHOD RENDER TO PRODUCTS-VIEW PAGE
const loadProductsview = async (req, res) => {
  try {
    const showProduct = await adproducts.find({}).lean()
    const showCategory = await adcategory.find({}).lean()
    // console.log(showCategory);
    res.render("admin/productsview", { admins: true, adminshead: true, product: true, products: showProduct, categorys: showCategory })


  } catch (error) {
    console.log("error loadProsuctsView " + error.message);
  }
}

// HERE THE METHOD IS TO ADD PRODUCTS WITH CATEGORY 
// ADD IMAGE USING MULTER

const addproducts = async (req, res) => {
  try {
    const length = req.files.length
    let image = []
    for (let i = 0; i < length; i++) {
      image[i] = req.files[i].filename
    }
    const productsData = new adproducts({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      image: image,
      description: req.body.description,
      stock: req.body.stock,
      status: 1
    })

    const data = await productsData.save();
    // console.log(data.category + "  ==============");
    res.redirect("/admin/products");
  } catch (error) {
    console.log("error addprooducts " + error.message);
  }
}

//============================================================

const loadEditProducts = async (req,res)=>{
  try {
    const  productId = req.query.id;
    const productData = await adproducts.findOne({_id:productId}).lean()
    const categorys = await adcategory.find({}).lean()
    console.log("product ---  ",productData);
    console.log("name--------",productData.price)
    res.render('admin/editProducts',{
       admins: true, 
       adminshead:true,
       name:productData.name,
       price:productData.price,
       category:productData.category,
       image:productData.image,
       stock:productData.stock,
       description:productData.description,
       id :productData._id,
       categorys
       
       })
       
  } catch (error) {
    console.log("loadEditProducts ",error.message);
  }
}

//===========================================================

const loadUpdateProduct = async (req,res)=>{

  try {
    const length = req.files.length
    let image = []
    for (let i = 0; i < length; i++) {
      image[i] = req.files[i].filename
    }
    const id = req.query.id
    
   await adproducts.findOneAndUpdate({_id:id},{$set:{
    name:req.body.name,
    price:req.body.price,
    stock:req.body.stock,
    category:req.body.category,
    image:image,
    description:req.body.description,
  }})
  
    res.redirect("/admin/productsview");
  } catch (error) {
    console.log("loadUpdateproduct ",error.message);
  }
}

// HERE THE THE METHOD IS TO UNLIST THE PRODUCT
const productunlist = async (req, res) => {
  try {
    const id = req.query.id
    const data = await adproducts.updateOne({ _id: id }, { $set: { status: 0 } })
    res.redirect("/admin/productsview")
  } catch (error) {
    console.log("error productlist " + error.message);
  }
}
// HERE THE THE METHOD IS TO LIST THE PRODUCT
const productlist = async (req, res) => {
  try {
    const id = req.query.id
    const data = await adproducts.updateOne({ _id: id }, { $set: { status: 1 } })
    res.redirect("/admin/productsview")
  } catch (error) {
    console.log("error productlist " + error.message);
  }
}
//HERE THE PAGE FIND COUPON ,ADMIN IS CREATERD
const loadcoupon = async (req, res) => {
  try {
    const couponData = await adcoupon.find({}).lean()
    res.render("admin/coupon", { admins: true, adminshead: true, couponData})
  } catch (error) {
    console.log("error loadAddToCart " + error.message);
  }
}
// ===============HRERE THE PAGE ADMIN CAM CREATE COUPON ==================
const addcoupon = async (req, res) => {
  try {
    const addCoupon = new adcoupon({
      couponName: req.body.couponName,
      couponCode: req.body.couponCode,
      discountValue: req.body.discountValue,
      maxAmountLimit: req.body.maxAmountLimit,
      minPurchase: req.body.minPurchase,
      startingDate: req.body.startingDate,
      endingDate: req.body.endingDate,
    })
    await addCoupon.save();


    res.render("admin/addcoupon", { admins: true, adminshead: true })
  } catch (error) {
    console.log("error addcoupon " + error.message)
  }
}
const loadaddcoupon = async (req, res) => {
  try {


    res.render("admin/addcoupon", { admins: true, adminshead: true })
  } catch (error) {
    console.log("error addcoupon " + error.message)
  }
}



const loadOrder = async (req, res) => {
  try {
    const orderDetails = await adOrder.find({}).sort({ $natural: -1 }).lean()

    console.log("orderDetails  " + orderDetails);
    res.render("admin/orderList", { admins: true, adminshead: true, orderDetails, order: true })
  } catch (error) {
    console.log('error in loadOrder ' + error.message);
  }
}
const loadOrderDetails = async (req, res) => {
  try {
    const id = req.query.id;
    const orderDetails = await adOrder.findOne({ _id: id }).lean();
    res.render("admin/orderDetails", { admins: true, adminshead: true, order: true, orderDetails })
  } catch (error) {
    console.log("error in loadUserOrderDetails " + error.message);
  }
}


const loadBanner = async (req, res) => {
  try {
    res.render("admin/banner", { admins: true, adminshead: true });
  } catch (error) {
    console.log("error loadAddBanner " + error.message);
  }
}

const loadAddBanner = async (req, res) => {

  try {
    const length = req.files.length
    let image = []
    for (let i = 0; i < length; i++) {
      image[i] = req.files[i].filename
    }
    console.log(req.files);
    console.log(req.body);
    const bannerData = new adBanner({
      name: req.body.name,
      image: image,
      description: req.body.description,
      status: true
    })
    await bannerData.save();
    res.redirect('/admin/banner')
  } catch (error) {
    console.log("error loadAddBanner " + error.message);
  }
}

const loadBannerView = async (req, res) => {

  try {
    const bannerData = await adBanner.find({}).lean();
    res.render("admin/bannerView", { admins: true, adminshead: true, bannerData })
  } catch (error) {
    console.log(" error loadBannerView", error.message);
  }

}
const bannerList = async (req, res) => {
  try {
    const id = req.query.id
    await adBanner.updateOne({ _id: id }, { $set: { status: true } })
    res.redirect('/admin/bannerView')
  } catch (error) {
    console.log("error bannerList ", error.message);
  }
}
const bannerUnlist = async (req, res) => {
  try {
    const id = req.query.id
    await adBanner.updateOne({ _id: id }, { $set: { status: false } })
    res.redirect('/admin/bannerView')
  } catch (error) {
    console.log("error bannerUnlist ", error.message);
  }
}
//HERRE THE PAGE DELETE BANNER 
const bannerDelete = async (req, res) => {
  try {
    const id = req.query.id
    await adBanner.deleteOne({ _id: id })
    res.json({ message: "success" })
  } catch (error) {
    console.log("error bannerDelete", error.message);
  }
}

//HERE THE PAGE ORDER DELIVERED
const loadOrderDelivered = async (req, res) => {
  try {
    const id = req.query.id
    await adOrder.updateOne({ _id: id }, { $set: { status: 'delivered' } })
    res.json({ message: 'success' })
  } catch (error) {
    console.log("loadOrderDelivered " + error.message);

  }
}
//here  the page refund complete 
const loadRefundCompleted = async (req, res) => {
  try {
    const id = req.query.id;
    const orderData = await adOrder.findOne({ _id: id })
    const userId = orderData.userId;
    const totalPurchasePrice = orderData.grandtotal;
    await adOrder.updateOne({ _id: id }, { $set: { status: 'refund completed' } })
    await registration.updateOne({ _id: userId }, { $inc: { wallet: totalPurchasePrice } });
    res.json({ message: 'success' })
  } catch (error) {
    console.log("loadRefundCompleted ", error.message);
  }
}

const loadReturnConformation = async (req, res) => {
  try {
    const id = req.query.id;
    console.log(id);

    const orderData = await adOrder.findOne({ _id: id })
    const products = orderData.product;
    console.log(("proodducts ", products))
    for (i = 0; i < products.length; i++) {
      const productId = products[i]._id;
      console.log(productId);
      const quantity = products[i].quantity;
      console.log(quantity);
      await adproducts.findByIdAndUpdate(productId, { $inc: { stock: quantity } })

    }

    await adOrder.updateOne({ _id: id }, { $set: { status: 'return request success' } })
    res.json({ message: 'success' })
  } catch (error) {
    console.log("loadReturnConformation ", error.message);
  }
}


// HERE THE METHODD IS TO LOGOUT USER 
// DESTROY SESSSION
const adminlogout = async (req, res) => {
  try {
    req.session.adminid = null;
    res.redirect("/admin");
  } catch (error) {
    console.log("error adminlogout " + error.message);
  }
};


module.exports = {
  loadlogin,
  loadadhome,
  loadusers,
  userblock,
  userunblock,
  adminlogin,
  adminlogout,
  loadcategory,
  addcategory,
  categorylist,
  categoryunlist,
  loadproduct,
  loadProductsview,
  addproducts,
  productlist,
  productunlist,
  loadcoupon,
  addcoupon,
  loadaddcoupon,
  loadOrder,
  loadOrderDetails,
  loadBannerView,
  loadAddBanner,
  loadBanner,
  bannerList,
  bannerUnlist,
  bannerDelete,
  loadOrderDelivered,
  loadReturnConformation,
  loadRefundCompleted,
  loadEditProducts,
  loadUpdateProduct
};

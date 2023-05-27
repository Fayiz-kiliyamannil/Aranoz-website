
const registration = require("../models/modeView");
const adproducts = require("../models/modelproduct");
const adCart = require("../models/modelCart")
const adorder = require("../models/modelUserOrder");
const adcoupon = require("../models/modelCoupon");
const { insertMany } = require("../models/modelCategory");
const adcategory = require('../models/modelCategory');



// CART-MANAGEMENT================HERE THE PAGE RENDER TO CART PAGE==================================  
const  loadCart = async (req, res) => {
    try {
      const userId = req.session.userid
      const userName = req.session.user;
      const cartList = await adCart.find({ userId: userId }).populate("products.productId").lean()
      if (cartList.length == 0) {
        res.render("user/emptyCart", { users: true, usershead: true, userName })
      }
      let [{ products }] = cartList;
      if (products.length == 0) {
        res.render('user/emptyCart', { users: true, userName, usershead: true })
      }
      else {
        const cartDataList = products.map(({ productId, quantity, totalPrice }) => ({
          _id: productId._id,
          name: productId.name,
          price: productId.price,
          image: productId.image,
          stock: productId.stock,
          quantity,
          totalPrice,
  
        }))
        req.session.cartDataList = cartDataList
        const takeOnlyTotalprice = products.map(({ totalPrice }) => ({
          totalPrice,
  
        }))
  
  
        const subTotal = takeOnlyTotalprice.reduce((total, num) => {
          return total + num.totalPrice
        }, 0);
  
  
        res.render("user/cart", { users: true, usershead: true, userName, cartDataList, subTotal });
      }
    } catch (error) {
      console.log("error loadCart " + error.message);
    }
  };


//CART-MANAGEMEN =============================HERE THE PAGE PRODUCT ADD-TO-CART===============================
const loadAddToCart = async (req, res) => {

    try {
      const productId = req.query.id
      const userId = req.session.userid
      const cart = await adCart.findOne({ userId: userId }).lean()
      const stock = await adproducts.findOne({ _id: productId }).lean()
      req.session.product = stock
      let price = stock.price
  
      if (cart) {
        productExist = await adCart.findOne({ userId: userId, "products.productId": productId })
        if (productExist) {
          await adCart.updateOne({ userId: userId, "products.productId": productId }, { $inc: { "products.$.quantity": 1, "products.$.totalPrice": price } })
        } else {
          await adCart.findOneAndUpdate({ userId: userId }, { $push: { products: { productId: productId, quantity: 1, totalPrice: price } } });
        }
      } else {
        await adCart.create({ userId: userId, products: { productId: productId, quantity: 1, totalPrice: price } })
  
      }
  
      res.json({ message: 'success' })
  
    } catch (error) {
      console.log("error loadAddToCart " + error.message);
  
    }
  }



//==================here product update the quantity=================

const loadUpdateQuantity = async (req, res) => {
    try {
      const id = req.query.id
      const quantity = req.body.count
      const stock = req.body.stock;
      const userId = req.session.userid;
      if (quantity <= stock) {
        const product = await adproducts.findOne({ _id: id })
        const totalPrice = product.price * quantity;
  
        await adCart.updateOne({ userId: userId, 'products.productId': id }, { $set: { "products.$.quantity": quantity, "products.$.totalPrice": totalPrice } })
        const noData = await adCart.updateOne({ userId: userId }, { $set: { outstock: false } })
        const cartList = await adCart.find({ userId: userId }).populate("products.productId").lean();
        const [{ products }] = cartList;
  
        const cartDataList = products.map(({ productId, quantity, totalPrice }) => ({
          _id: productId._id,
          name: productId.name,
          price: productId.price,
          image: productId.image,
          stock: productId.stock,
          quantity,
          totalPrice,
  
  
        }))
        req.session.cartDataList = cartDataList;
        const subTotal = cartDataList.reduce((total, num) => total + num.totalPrice, 0);
  
  
  
        res.json({ message: "success", subTotal, totalPrice, noData: "" });
      }
      else {
  
  
        res.json({ status: false, message: "Out of stock" });
        const out = await adCart.updateOne({ userId: userId }, { $set: { outOfStock: true } })
        console.log("out of stockkkk   " + out);
      }
  
  
    } catch (error) {
      console.log("error loadUpdateQuantity " + error.message);
    }
  }
  

  module.exports = {
    loadCart,
    loadAddToCart,
    loadUpdateQuantity,
  }
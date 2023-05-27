
const adorder = require("../models/modelUserOrder");

//===============================HERE THE PAGE SHOW USER ORDER HISTORY =====================================
const loadOrderDetails = async (req, res) => {
    try {
      const userName = req.session.user;
      const userId = req.session.userid
      const order = await adorder.find({ userId: userId }).sort({ $natural: -1 }).lean()
      res.render("user/orderHistory", { users: true, usershead: true, order, userName })
    } catch (error) {
      console.log("error loadOrderDetails " + error.message);
    }
  }


//  HERE THE PAGE SHOW THE ORDER HISTORY FOR USER ===============================

const orderDetailsHistory = async (req, res) => {
    try {
      const userName = req.session.user;
      const Id = req.query.id;
      const order = await adorder.findOne({ _id: Id }).lean()
      console.log("order   ------", order);
      res.render("user/orderDetailsHistory", { users: true, usershead: true, order, userName });
    } catch (error) {
      console.log("error orderDetailsHistory " + error.message)
    }
  }



const successDelivery = async (req, res) => {
    try {
      const userName = req.session.user;
      const userId = req.session.userid
      const orderDetails = await adorder.findOne({ userId: userId }).sort({ $natural: -1 });
  
      const name = orderDetails.deliveryaddress.name;
      const orderId = orderDetails._id;
      const date = orderDetails.orderdate;
      const product = orderDetails.product;
      const paymentMethod = orderDetails.paymentmethod;
      const delivery = orderDetails.deliveryaddress
      const grandtotal = orderDetails.grandtotal;
  
      console.log("orderDetails  + ", orderDetails.deliveryaddress.name);
      res.render('user/confirmation', { users: true, usershead: true, orderId, date, product, paymentMethod, delivery, grandtotal, userName })
    } catch (error) {
      console.log("error successsDelivery " + error.message);
    }
  }
  
  



  module.exports = {
    loadOrderDetails,
    orderDetailsHistory,
    successDelivery,
  }
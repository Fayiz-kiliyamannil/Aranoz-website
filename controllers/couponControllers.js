const adcoupon = require("../models/modelCoupon");




//=================================HERE THE PAGE TRY COUPON CODE ========================================
const userTryCoupon = async (req, res) => {
    try {
      const couponId = req.body.coupon
      let couponError = ""
      console.log("coupon id -- " + couponId);
      const checkCoupon = await adcoupon.findOne({ couponCode: couponId });
  
      if (checkCoupon) {
        const date = new Date().toLocaleString();
        subTotal = req.session.subTotal;
        if (date > checkCoupon.endingDate && checkCoupon.status == true && subTotal >= checkCoupon.maxAmountLimit) {
          req.session.coupon = couponId;
          console.log("success " + req.session.coupon);
          couponError = ""
          req.session.couponError = couponError;
        } else {
          couponError = "Invalid Coupon"
          req.session.couponError = couponError;
          console.log("coupon Invalid2");
        }
      }
      else {
        couponError = "Invalid Coupon"
        req.session.couponError = couponError;
        console.log("coupon Invalid1");
      }
  
      res.redirect("/checkout")
    } catch (error) {
      console.log("error userTryCoupon " + error.message);
    }
  }



//HERE THE PAGE  REMOVE THE COUPON THAT APPLIED
const removeUserTryCoupon = async (req, res) => {
    try {
      req.session.coupon = 0;
      res.redirect("/checkout")
    } catch (error) {
      console.log("romoveUserTryCoupon ", error.message);
    }
  }
  

  module.exports = {
    userTryCoupon,
    removeUserTryCoupon,
  }
  
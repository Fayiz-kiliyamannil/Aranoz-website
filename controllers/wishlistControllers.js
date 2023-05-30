const adCart = require("../models/modelCart")
const adWishlist = require("../models/modelWishlist");




//here the methood render to wishlist
const loadWishList = async (req, res) => {
    try {
      const userName = req.session.user;
      const userId = req.session.userid
      const wishlist = await adWishlist.find({ userId: userId }).populate('products.productId').lean();
      if (wishlist.length == 0) {
        res.render('user/emptyWishlist', { users: true, usershead: true, userName });
      }
      let [{ products }] = wishlist;
      if (products.length === 0) {
        res.render('user/emptyWishlist', { users: true, usershead: true, userName });
  
      } else {
        const dataWishlist = products.map(({ productId }) => ({
          _id: productId._id,
          name: productId.name,
          price: productId.price,
          image: productId.image,
          stock:productId.stock,
        }));
  
        res.render('user/wishlist', { users: true, usershead: true, userName, dataWishlist });
  
      }
    } catch (error) {
      console.log("error loadWishList " + loadWishList);
    }
  }



//================================HERE THE PAGE RNEDER TO WISLIST --------------------------------------
const addToWishlist = async (req, res) => {
    try {
      const productId = req.query.id;
      const userId = req.session.userid
      const wishlist = await adWishlist.findOne({ userId: userId }).lean();
  
      if (wishlist) {
        productExist = await adWishlist.findOne({ userId: userId, "products.productId": productId })
        if (productExist) {
          productExist = await adWishlist.findOne({ userId: userId, "products.productId": productId })
        } else {
          await adWishlist.findOneAndUpdate({ userId: userId }, { $push: { products: { productId: productId } } });
        }
      } else {
        await adWishlist.create({ userId: userId, products: { productId: productId } });
      }
      res.json({ message: "success" })
    } catch (error) {
      console.log("error addToWishlist " + error.message);
    }
  }


//----------------HERE THE PAGE REMOVE THE WISHHLIST----------------------------------
const removeWishlist = async (req, res) => {

    try {
      const productId = req.query.id
      const userId = req.session.userid
      await adWishlist.findOneAndUpdate({ userId: userId }, { $pull: { products: { productId: productId } } });
      res.json({ message: "success" })
    } catch (error) {
      console.log("removeWishlist error " + error.message);
    }
  }

  module.exports = {
    loadWishList,
    addToWishlist,
    removeWishlist,
  }
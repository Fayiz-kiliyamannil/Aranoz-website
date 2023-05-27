
const adproducts = require("../models/modelproduct");
const adCart = require('../models/modelCart');
const adcategory = require('../models/modelCategory')



// HERE THE PAGE RNDER TO SHOP PAGE` with pagination----------
const loadShop = async (req, res) => {
    try {
  
      const categoryList = await adcategory.find({ categoryStatus: 1 }).lean()
      const Products = await adproducts.find({ status: 1 })
        .populate({
          path: 'category',
          match: { categoryStatus: 1 }
        })
        .lean();
  
  
  
      var page = 1;
      if (req.query.page) {
        page = req.query.page
      }
      const limit = 8;
      var search = req.query.search || ''; // Get the search value from req.query or set to empty string if not present
      var categoryId = req.query.categoryId; // Get the categoryId value from req.query
      var sortValue = req.query.sortValue || 1
      userName = req.session.user;
  
      var sortValue = 1;
      if (req.query.sortValue) {
        sortValue = req.query.sortValue;
      }
  
      const query = {
        $or: [
          { name: { $regex: '.*' + search + '.*', $options: 'i' } },
          { description: { $regex: '.*' + search + '.*', $options: 'i' } }
        ],
        // price: { $gte: minPrice, $lte: maxPrice }
      };
  
  
  
      if (categoryId) {
        query.category = categoryId;
      }
  
      const productsData = await adproducts.find({
        ...query,
        _id: { $in: Products.map(product => product._id) }
      })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ price: sortValue })
        .exec();
  
      const count = await adproducts.find(query).countDocuments();
      totalPages = Math.ceil(count / limit);
  
      currentPage = page
      nextPage = currentPage + 1
      previousPage = currentPage - 1
  
  
  
  
      res.render("user/shop", { users: true, usershead: true, totalPages, currentPage, nextPage, previousPage, categoryId, sortValue, userName, productsData, categoryList });
  
  
  
    } catch (error) {
      console.log("error loadShop " + error.message);
    }
  };

  //HERE THE PAGE RNEDER TO PRODUCTDETAILS
const loadProductDetails = async (req, res) => {
    try {
      const id = req.query.id;
      const showProducts = await adproducts.find({ _id: id }).lean();
      res.render("user/productDetails", {
        users: true,
        usershead: true,
        product: showProducts,
      });
    } catch (error) {
      console.log("error productDetails " + error.message);
    }
  };

  



        module.exports = {
            loadShop,
            loadProductDetails,
        }
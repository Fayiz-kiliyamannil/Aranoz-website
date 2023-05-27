 const mongoose = require('mongoose');

 const userWishlistSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,ref:"userRegistration",

    },
    products:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,ref:'product',
        }
    }]

 })  

 module.exports = mongoose.model('wishlist',userWishlistSchema)


 

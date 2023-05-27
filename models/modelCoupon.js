const mongoose = require("mongoose");

const couponSchema = new  mongoose.Schema({
    couponName:{
        type:String,
        require:true,
        },
        couponCode:{
            type:String,
            require:true,
        },
        discountValue:{
            type:String,
            require:true,

        },
        maxAmountLimit:{
            type:String,
            require:true,
        },
        minPurchase:{
          type:String,
          require:true,
        },
        startingDate:{
            type:String,
            require:true,

        },
        endingDate:{
            type:String,
            require:true,
        },
        status:{
            type:Boolean,
            default:true,
        }
})

module.exports = mongoose.model('coupon',couponSchema);

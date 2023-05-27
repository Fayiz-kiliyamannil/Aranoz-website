const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId :{
        type:mongoose.Schema.Types.ObjectId,ref:"userRegistration"
    },
    products:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,ref:"product"
        },
        quantity:{
            type:Number
        },
        totalPrice:{
            type:Number,
            default:0
        },
    }],
    outOfStock:{
    type:Boolean,
    default:false,
    } 
} ,{timeStamps:true});

module.exports = mongoose.model("cart", userSchema);

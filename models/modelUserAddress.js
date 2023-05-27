const mongoose = require('mongoose')

const userAddressSchema = new mongoose.Schema({

    id:{
        type:Object,
        require:true,
    },
    name:{
        type:String,
        require:true,
    },
    surname:{
        type:String,
        require:true,
    },
    phone:{
         type:String,
         require:true
    },
    address:{
        type:String,
        require:true,
    },
    district:{
        type:String,
        require:true,
    },
    pincode:{
        type:Number,
        require:true,
    },
    state:{
        type:String,
        require:true,
    },
    area:{
        type:String,
        require:true,
    },
    country:{
        type:String,
        require:true,
    }

})
module.exports = mongoose.model("adress",userAddressSchema);

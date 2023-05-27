const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
     phone:{
        type:Number,
        require:true
    },
    is_admin:{
        type:Number,
        reequire:true
    },
    wallet:{
        type:Number,
        default:0
    },
    walletHistory:{
        type:Array,
    }
    
})

module.exports = mongoose.model("userRegistration",userSchema);
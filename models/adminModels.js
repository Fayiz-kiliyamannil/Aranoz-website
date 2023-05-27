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
    }
    
})

module.exports = mongoose.model("admindetails",userSchema);
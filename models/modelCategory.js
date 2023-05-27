const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    categoryStatus:{
        type:Number,
        require:true
    }
})
module.exports= mongoose.model("category",adminSchema);
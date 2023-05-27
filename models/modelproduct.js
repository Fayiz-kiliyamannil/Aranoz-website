const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    price:{
        type:Number,
        require:true,
    },
    category:{
        type:String,
        require:true,
    },

    image:{
       type:Array,
       require:true,
    },
    
   description:{
    type:String,
    require:true,
   },
   stock:{
    type:Number,
    require:true,
   },
   status:{
    type:Number,
    require:true,
   }

  
})

module.exports = mongoose.model("product",adminSchema);

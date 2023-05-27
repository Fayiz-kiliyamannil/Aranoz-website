const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:Array,
        required:true,
    },
    status:{
        type:Boolean,
        required:true,
    }
});

module.exports = mongoose.model('banner', bannerSchema);

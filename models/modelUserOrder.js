const mongoose = require('mongoose');

const userOrderSchema = new mongoose.Schema({

    odereduser: {
        type: String,
        require: true
    },
    deliveryaddress: {
        name: {
            type: String
        },
        email: {
            type: String
        },
        phone: {
            type: String
        },
        state: {
            type: String
        },
        country: {
            type: String
        },
        address: {
            type: String
        },
        district: {
            type: String
        },
        pincode: {
            type: String
        },

    },
    grandtotal: {
        type: Number,
        require: true
    },
    product: {
        type: Array,
        required: true

    },
    userId:{
        type:String,
        required:true,
    },
    orderdate: {
        type: String,
        required: true
    },
    paymentmethod: {
        type: String,
        required: true
    },
    // deliverydate: {
    //     type: String,
    //     required: true
    // },
    status: {
        type: String,
        required: true
    },
    returnstatus: {
        type: Boolean,
        required: true
    },
    // salesdate: {
    //  type:String,
    //  required:true
    // }

})
module.exports = mongoose.model('order',userOrderSchema);
const mongoose = require("mongoose");

const stateModel = new mongoose.Schema({
    name:{
        type:String,
        require: true,
        unique:true
    },
    created_on: {
        type: Date,
        default: Date.now
    },
    is_active:{
        type: Boolean,
        default: true
    }
});

module.exports = new mongoose.model("state",stateModel);
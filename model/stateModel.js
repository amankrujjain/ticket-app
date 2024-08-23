const mongoose = require("mongoose");

const stateModel = new mongoose.Schema({
    name:{
        type:String,
        require: true,
        unique:true
    },
    is_active:{
        type: Boolean,
        default: true
    }
});

module.exports = new mongoose.model("state",stateModel);
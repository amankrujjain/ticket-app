const mongoose = require("mongoose");

const stateModel = new mongoose.Schema({
    name:{
        type:String,
        require: true,
        unique:true
    }
});

module.exports = new mongoose.model("state",stateModel);
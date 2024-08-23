const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required: true
    },
    state:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"state",
        required:true
    },
    is_active:{
        type:Boolean,
        default: true,
    }
});

module.exports = new mongoose.model("city", citySchema);
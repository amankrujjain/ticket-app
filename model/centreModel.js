const mongoose = require("mongoose");

const centreSchema = new mongoose.Schema({
    name:{
        type:String,
        unique: true,
        required: true
    },
    state:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"state",
        required: true
    },
    city:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"city",
        required: true
    },
    district:{
        type: String,
        required: true
    },
    pincode:{
        type: String,
        required: true
    },
    is_active:{
        type: Boolean,
        default: true
    }
});

module.exports = new mongoose.model("centre", centreSchema);
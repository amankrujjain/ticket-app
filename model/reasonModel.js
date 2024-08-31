const mongoose = require("mongoose");

const reasonModel = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    tat:{
        type: Number,
        required: true
    },
    issue:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"issues",
        required: true
    },
    is_active: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("reasons", reasonModel);
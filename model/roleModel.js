const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    is_active:{
        type: Boolean,
        default: true
    }
});

module.exports = new mongoose.model("UserRole",RoleSchema)
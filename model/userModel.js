const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    phone:{
        type:Number,
        required: true,
    },
    employee_id:{
        type:String,
        required: true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    profile_pic:{
        type: String,
        required:false,
    },
    role:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserRole",
        required:true,
    },
    is_active:{
        type:Boolean,
        default: true
    }
});

module.exports = new mongoose.model("User",UserSchema)
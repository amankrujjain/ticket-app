const mongoose = require('mongoose');

const stageSchema = new mongoose.Schema({
    stage_name:{
        type: String,
        required: true,
        unique: true,
    },
    created_on:{
        type: Date,
        default: Date.now()
    },
    is_active:{
        type: Boolean,
        default: true,
    }
});

module.exports  = mongoose.model("stage", stageSchema);
const mongoose = require("mongoose");

const issueModel = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    is_active:{
        type: Boolean,
        default: true
    }
});

const issue = mongoose.model("issues", issueModel);

module.exports = issue;
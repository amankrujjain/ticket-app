const mongoose = require("mongoose");

const issueModel = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    is_active:{
        type: Boolean
    }
});

const issue = new mongoose.model("issues", issueModel);

module.exports = issue;
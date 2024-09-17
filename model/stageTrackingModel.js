const mongoose = require("mongoose");

const stageTrackingSchema = new mongoose.Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ticket",
        required: true
    },
    stage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stage",
        required: true
    },
    changed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    description:{
        type: String,
        required: false
    },
    next_action_date:{
        type: Date,
    }
    ,
    changed_on: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("StageTracking", stageTrackingSchema);

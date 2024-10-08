const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    description: {
        type: String,
    },
    ticket_id:{
        type:String,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    issue:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"issues"
    },
    reason: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "reasons",
        required: true
    },
    machine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "machine",
        required: true
    },
    centre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "centre",
    },
    created_on: {
        type: Date,
        default: Date.now
    },
    generatedDate: {
        type: Date 
    },
    stage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stage",
    },
    is_active: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open"
    }
});

module.exports = mongoose.model("ticket", ticketSchema);

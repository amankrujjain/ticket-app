const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
    machine_serial_number: {
        type: String,
        required: true,
        unique: true
    },
    is_active: {
        type: Boolean,
        default: true
    },
    purchase_from: {
        type: String,
        required: true
    },
    centre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "centre",
        required: true
    },
    qr_code_url: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model("machine", machineSchema);

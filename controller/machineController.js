const Machine = require("../model/machineModel");
const Centre = require("../model/centreModel");
const { validationResult } = require("express-validator");
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const createMachine = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: errors.array(),
            });
        }

        const { machine_serial_number, is_active, purchase_from, centre } = req.body;

        const existingMachine = await Machine.findOne({ machine_serial_number });
        if (existingMachine) {
            return res.status(409).json({
                success: false,
                message: "Machine with the same serial number already exists.",
            });
        }

        const centreObj = await Centre.findById(centre).populate('city').populate('state');
        if (!centreObj) {
            return res.status(400).json({
                success: false,
                message: "Invalid centre provided.",
            });
        }

        // Create a string containing the information for the QR code
        const qrData = `Serial Number: ${machine_serial_number}\nPurchase From: ${purchase_from}\nCentre: ${centreObj.name}\nCity: ${centreObj.city.name}\nState: ${centreObj.state.name}`;

        // Generate the QR code and save it to the public folder
        const qrCodePath = path.join(__dirname, '../public/qr_codes/', `${machine_serial_number}.png`);
        await QRCode.toFile(qrCodePath, qrData);

        const qrCodeUrl = `/qr_codes/${machine_serial_number}.png`; // This would be the public URL

        const newMachine = new Machine({
            machine_serial_number,
            is_active,
            purchase_from,
            centre: centreObj._id,
            qr_code_url: qrCodeUrl
        });

        await newMachine.save();

        return res.status(201).json({
            success: true,
            message: "Machine registered successfully",
            data: newMachine,
        });

    } catch (error) {
        console.error("Error occurred while registering machine:", error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred while processing your request.",
        });
    }
};
const getMachines = async (_, res) => {
    try {
        const machines = await Machine.find().populate({
            path: 'centre',
            populate: [
                { path: 'state' },
                { path: 'city' }
            ]
        });
        
        return res.status(200).json({
            success: true,
            data: machines,
        });
    } catch (error) {
        console.error("Error occurred while fetching machines:", error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching machines.",
        });
    }
};

module.exports = {
    createMachine,
    getMachines
};
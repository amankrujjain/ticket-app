const Centre = require("../model/centreModel");
const {validationResult} = require("express-validator");
const stateModel = require("../model/stateModel");
const cityModel = require("../model/cityModel");

const createCentre = async(req,res)=>{
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errros: errors.array()
            });
        };

        const {name, state, city, district, pincode} = req.body;

        const stateObj = await stateModel.findOne(state);

        if(!stateObj){
            return res.status(404).json({
                success: false,
                message:"No valid state found"
            });
        };

        const cityObj = await cityModel.findOne(city);

        if(!cityObj){
            return res.status(404).json({
                success: false,
                message:"No valid city found"
            })
        };

        const newCentre = await new Centre({
            name,
            state: stateObj._id,
            city: cityObj._id,
            district,
            pincode
        });

        await newCentre.save();

        return res.status(201).json({
            success: true,
            message:"Centre created successfully",
            data: newCentre
        })

    } catch (error) {
        console.log("Error while creating a centre:", error.message);
        return res.status(500).json({
            success: false,
            message:"An unexpected error occured while creating centre"
        });
    };
};

module.exports = {
    createCentre
}
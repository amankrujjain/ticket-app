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
                errors: errors.array()
            });
        };

        const {name, state, city, district,full_address, pincode} = req.body;

        const stateObj = await stateModel.findById(state);
        console.log("This is the logged state->", stateObj)

        if(!stateObj){
            return res.status(404).json({
                success: false,
                message:"No valid state found"
            });
        };

        const cityObj = await cityModel.findById(city);
        console.log("Logged city Object->", cityObj)

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
            full_address,
            district,
            pincode
        });
        console.log("New centre->", newCentre)
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

const getCentre = async(_,res)=>{
    try {
        const centres = await Centre.find().populate("state city");
        return res.status(200).json({
            success: true,
            message:"Centres are fetched successfully",
            data: centres
        });
    } catch (error) {
        console.log("error while fetching centres:", error);
        return res.status(500).json({
            success: false,
            message:"A unexpected error occured while processsing you request"
        })
    };
};

const getCentreById = async(req,res)=>{
    try {
        const {id} = req.params;

        const centres = await Centre.findById(id).populate("state city");

        if(!centres){
            return res.status(404).json({
                success: false,
                message:"No valid centre found"
            });
        };

        return res.status(200).json({
            success: true,
            message:"Search successful",
            data: centres
        });

    } catch (error) {
        console.log("Error while searching centres by Id :", error);
        return res.status(500).json({
            success: false,
            message:"An unexpected error occured while processing your request"
        });
    };
};

const updateCentre = async(req,res)=>{
    try {
        const {name, state, city, district, } = req.body;
    } catch (error) {
        
    }
}

module.exports = {
    createCentre,
    getCentre,
    getCentreById
}
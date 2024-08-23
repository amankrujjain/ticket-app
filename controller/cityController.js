const City = require("../model/cityModel");

const { validationResult } = require("express-validator");
const State = require("../model/stateModel");

const createCity = async(req,res)=>{
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                message:"Validatiion failed",
                error: errors.array()
            });
        };

        const {name, state} = req.body;
        

        const existingCity = await City.findOne({name});

        if(existingCity){
            return res.status(409).json({
                success: false,
                message:"No valid city found."
            });
        };

        const stateObj = await State.findById(state);
        
        if(!stateObj){
            return res.status(404).json({
                success: false,
                message:"No valid state found"
            });
        };

        const newCity = new City({name, state: stateObj._id});
        await newCity.save();

        return res.status(201).json({
            success: true,
            message:"City successfully created",
            data: newCity
        })
    } catch (error) {
        console.log("Error occured while creating city:",error);
        return res.status(500).json({
            success:false,
            message:"An unexpected error occured while creating state"
        });
    };
};

const getCity = async(req,res)=>{
     try {
        const cities = await City.find().populate("state");
        return res.status(200).json({
            success: true,
            data: cities
        });


     } catch (error) {
        console.log("Error while fetching cities:", error);
        return res.status(500).json({
            success: false,
            message:"An error occured while fetching the cities"
        });
     };
};



module.exports = {
    createCity,
    getCity
}
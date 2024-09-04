const Stage = require("../model/stageModel");
const {validationResult} = require("express-validator");

const createStage = async(req,res)=>{
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty){
            return res.status(400).json({
                success: false,
                message:"Validation failed",
                error: errors.array()
            });
        };

        const {stage_name} = req.body;

        const existingStage = await Stage.findOne({stage_name});

        if(existingStage){
            return res.status(409).json({
                success: false,
                message:"Stage name already exists"
            });
        };

        const newStage = new Stage({
            stage_name,
        });

        await newStage.save();

        return res.status(201).json({
            success: true,
            message:"Stage succcessfully created",
            data: newStage
        });
    } catch (error) {
        console.log("Error occured while creating stage", error.message);

        return res.status(500).json({
            success: false,
            message:"An unexpected error occured while processing your request"
        });
    };
};

const getAllStage = async(_,res) => {
    try {
        const allStage = await Stage.find();

        if(!allStage){
            return res.status(404).json({
                success: false,
                message:"No data found"
            })
        };

        return res.status(200).json({
            success: true,
            message:"Data fetched successfully",
            data: allStage
        })
    } catch (error) {
        console.log("Error occured while fetching stage", error.message);
        return res.status(500).json({
            success: false,
            message:"Error occured while processing your request."
        })
    }
}

module.exports = {
    createStage,
    getAllStage
}
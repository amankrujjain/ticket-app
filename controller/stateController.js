const State = require("../model/stateModel");
const {validationResult} = require("express-validator");

const createState = async(req,res)=>{
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                message:"Validation error",
                errors: errors.array()
            });
        };

        const {name} = req.body;

        const existingState = await State.findOne({name});

        if(existingState){
            return res.status(409).json({
                success: false,
                message:"State with the same name already exists.",
            });
        };

        const newState = new State({name});
        await newState.save()

        return res.status(201).json({
            success:true,
            message:"State successfully created",
            data:newState
        })

    } catch (error) {
        console.log("Error while creating state:",error);
        return res.status(500).json({
            success: false,
            message:"An error occured while creating state"
        })
        
    }
}
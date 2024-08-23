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

        const existingState = await State.findOne({name, is_active:true});

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
        });
        
    };
};

const getState = async(_,res)=>{
    try {
        const state = await State.find();
        return res.status(200).json({
            success: true,
            data: state
        });
    } catch (error) {
        console.log("Error while fetching state--->", error);
        return res.status(500).json({
            success:false,
            message:"An error occured while fetching state.",
        });
    };
};

const updateState = async(req,res)=>{
    try {
        const {id} = req.params;
        const {name} = req.body;

        const state = await State.findByIdAndUpdate(
            id,{name},{new: true}
        )

        if(!state){
            return res.status(404).json({
                success: false,
                message:"No valid state found."
            });
        };

        return res.status(200).json({
            success: true,
            message:"State updated successfully",
            data: state
        });

    } catch (error) {
        console.log("Error occure while updating state:", error);
        return res.status(500).json({
            success: false,
            message:"An error occured while updating the state"
        });
        
    };
};

const activateState = async(req,res)=>{
    try {
        const {id} = req.params;

        const state = await State.findById(id);

        if(!state){
            return res.status(404).json({
                success: false,
                message:"No valid state found"
            });
        };

        if(state.is_active){
            return res.status(409).json({
                success:false,
                message:"State already active"
            });
        };

        state.is_active = true;
        await state.save();

        return res.status(200).json({
            success: true,
            message:"State successfully activated",
            data: state
        });

    } catch (error) {
        console.log("Error while reactivating state:", error);
        return res.status(500).json({
            success: false,
            message:"An unexpected error occured while activating state"
        });
    };
};

const deleteState = async(req,res)=>{
    try {
        const {id} = req.params;
        const state = await State.findById(id);
        if(!state){
            return res.status(404).json({
                success: false,
                message:"No valid state found."
            });
        };

        if(!state.is_active){
            return res.status(409).json({
                success: false,
                message:"State already deleted."
            });
        };

        state.is_active = false;
        await state.save();

        return res.status(200).json({
            success: true,
            message:"State successfully deleted",
            data: state
        })

    } catch (error) {
        console.log("Error while deleting state:", error);
        return res.status(500).json({
            success: false,
            message:"An error occured while deleting the state"
        })
    }
}

module.exports = {
    createState,
    getState,
    updateState,
    deleteState,
    activateState
}
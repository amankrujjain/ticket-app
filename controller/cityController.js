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
                message:"City already exists."
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

const getCity = async(_,res)=>{
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

const getCityById = async (req, res) => {
    try {
        const { id } = req.params;
        const city = await City.findById(id).populate('state');

        if (!city) {
            return res.status(404).json({
                success: false,
                message: "City not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: city,
        });

    } catch (error) {
        console.error("Error occurred while fetching city:", error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the city.",
        });
    }
};

const updateCity = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array()
            });
        }

        const { name, state } = req.body;
        const cityId = req.params.id;
        const updateData = {};

        if (name) {
            updateData.name = name;
        }

        if (state) {
            if (!mongoose.Types.ObjectId.isValid(state)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid state provided."
                });
            }
            updateData.state = state;
        }

        const updatedCity = await City.findByIdAndUpdate(cityId, updateData, { new: true });

        if (!updatedCity) {
            return res.status(404).json({
                success: false,
                message: "City not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "City updated successfully",
            data: updatedCity
        });
    } catch (error) {
        console.log("Error occurred while updating city:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred while updating city"
        });
    }
};


const activateCity = async(req,res)=>{
    try {
        const {id} = req.params;

        const city = await City.findById(id);

        if(!city){
            return res.status(404).json({
                success: false,
                message:"No valid city found"
            });
        };

        if(city.is_active){
            return res.status(409).json({
                success:false,
                message:"City already active"
            });
        };

        city.is_active = true;
        await city.save();

        return res.status(200).json({
            success: true,
            message:"City successfully activated",
            data: city
        });

    } catch (error) {
        console.log("Error while reactivating state:", error);
        return res.status(500).json({
            success: false,
            message:"An unexpected error occured while activating state"
        });
    };
};

const deleteCity = async(req,res)=>{
    try {
        const {id} = req.params;
        const city = await City.findById(id);
        if(!city){
            return res.status(404).json({
                success: false,
                message:"No valid city found."
            });
        };

        if(!city.is_active){
            return res.status(409).json({
                success: false,
                message:"City already deleted."
            });
        };

        city.is_active = false;
        await city.save();

        return res.status(200).json({
            success: true,
            message:"City successfully deleted",
            data: city
        })

    } catch (error) {
        console.log("Error while deleting city:", error);
        return res.status(500).json({
            success: false,
            message:"An error occured while deleting the city"
        })
    }
}


module.exports = {
    createCity,
    getCity,
    getCityById,
    activateCity,
    updateCity,
    deleteCity
}
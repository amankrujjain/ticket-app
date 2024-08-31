const Reason = require("../model/reasonModel");

const { validationResult } = require("express-validator");
const Issue = require("../model/issueModel");

const createReason = async(req,res)=>{
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                message:"Validatiion failed",
                error: errors.array()
            });
        };

        const {name, tat, issue} = req.body;

        const existingReason = await Reason.findOne({name});

        if(existingReason){
            return res.status(409).json({
                success: false,
                message:"Reason already exists."
            });
        };

        const issueObj = await Issue.findById(issue);
        
        if(!issueObj){
            return res.status(404).json({
                success: false,
                message:"No valid issue found"
            });
        };

        const newReason = new Reason({name, issue: issueObj._id, tat});
        await newReason.save();

        return res.status(201).json({
            success: true,
            message:"Reason successfully created",
            data: newReason
        })
    } catch (error) {
        console.log("Error occured while creating reason:",error.message);
        return res.status(500).json({
            success:false,
            message:"An unexpected error occured while processing your request"
        });
    };
};

const getReason = async(_,res)=>{
     try {
        const reasons = await Reason.find().populate("issue");
        return res.status(200).json({
            success: true,
            data: reasons
        });

     } catch (error) {
        console.log("Error while fetching reason:", error);
        return res.status(500).json({
            success: false,
            message:"An error occured while fetching the reasons"
        });
     };
};

const getReasonById = async (req, res) => {
    try {
        const { id } = req.params;
        const reason = await Reason.findById(id).populate('issue');

        if (!reason) {
            return res.status(404).json({
                success: false,
                message: "Reason not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: reason,
        });

    } catch (error) {
        console.error("Error occurred while fetching reason:", error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the reason.",
        });
    }
};

const updateReason = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array()
            });
        }

        const { name, tat, issue } = req.body;
        const reasonId = req.params.id;
        const updateData = {};

        if (name) {
            updateData.name = name;
        };
        if(tat){
            updateData.tat = tat;
        }

        if (issue) {
            if (!mongoose.Types.ObjectId.isValid(issue)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid issue provided."
                });
            }
            updateData.issue = issue;
        }

        const updatedReason = await City.findByIdAndUpdate(reasonId, updateData, { new: true });

        if (!updatedReason) {
            return res.status(404).json({
                success: false,
                message: "Issue not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Issue updated successfully",
            data: updatedReason
        });
    } catch (error) {
        console.log("Error occurred while updating reason:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred while updating reason"
        });
    }
};


// const activateCity = async(req,res)=>{
//     try {
//         const {id} = req.params;

//         const city = await City.findById(id);

//         if(!city){
//             return res.status(404).json({
//                 success: false,
//                 message:"No valid city found"
//             });
//         };

//         if(city.is_active){
//             return res.status(409).json({
//                 success:false,
//                 message:"City already active"
//             });
//         };

//         city.is_active = true;
//         await city.save();

//         return res.status(200).json({
//             success: true,
//             message:"City successfully activated",
//             data: city
//         });

//     } catch (error) {
//         console.log("Error while reactivating state:", error);
//         return res.status(500).json({
//             success: false,
//             message:"An unexpected error occured while activating state"
//         });
//     };
// };

const deleteReason = async(req,res)=>{
    try {
        const {id} = req.params;
        const reason = await Reason.findById(id);
        if(!reason){
            return res.status(404).json({
                success: false,
                message:"No valid reason found."
            });
        };

        if(!reason.is_active){
            return res.status(409).json({
                success: false,
                message:"Reason already deleted."
            });
        };

        reason.is_active = false;
        await reason.save();

        return res.status(200).json({
            success: true,
            message:"Reason successfully deleted",
            data: reason
        })

    } catch (error) {
        console.log("Error while deleting reason:", error);
        return res.status(500).json({
            success: false,
            message:"An error occured while deleting the reason"
        })
    }
}


module.exports = {
    createReason,
    getReason,
    getReasonById,
    updateReason,
    deleteReason
}
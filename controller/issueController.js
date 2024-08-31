
const Issue = require("../model/issueModel");
const {validationResult} = require("express-validator");
const mongoose = require("mongoose")

const createIssue = async(req,res)=>{
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors
            });
        };

        const {name} = req.body;

        const existingIssue = await Issue.findOne({name});


        if(existingIssue){
            return res.status(409).json({
                success: false,
                messgae:"Issue already exists"
            });
        };

        const newIssue = new Issue({
            name
        });

        await newIssue.save();

        return res.status(201).json({
            success: true,
            message:"Issue created successfully",
            data: newIssue
        });
    } catch (error) {
        console.log("Error occured while creating the new issue:", error);
        return res.status(500).json({
            success: false,
            message:"An unexpected error occured while creating issue"
        });
    };
};

const getIssue = async(_,res)=>{
    try {
        const issues = await Issue.find({is_active: true});

        if( issues){
            return res.status(200).json({
                success: true,
                message:"Issues fetched successfully",
                data: issues
            });
        };
    } catch (error) {
        console.log("Errro while fecthing issues:" ,error);
        return res.status(500).json({
            success: false,
            message:"An unexpected errro occured while fetching the data."
        });
    };
};

const getIssueById = async(req,res)=>{
    try {
        const {id} = req.params;
        
        const issue = await Issue.findById(id);

        if(!issue){
            return res.status(404).json({
                success: false,
                message:"Issues doesn't exists"
            });
        };

        return res.status(200).json({
            success: true,
            message:"Data fetched successfully",
            data: issue
        });
    } catch (error) {
        console.log("Error occured while finding issue:", error);
        return res.status(500).json({
            success: false,
            message:"An unexpected error occured while processing your request"
        });
    };
};

const updateIssue = async(req,res)=>{
    try {
        const {id} = req.params;
        const {name} = req.body;

        const issue = await Issue.findByIdAndUpdate(id, {name},{new:true});

        if(!issue){
            return res.status(404).json({
                success: false,
                message:"No issues were found"
            });
        };

        return res.status(200).json({
            success: true,
            message:"Issue found and updated successfully",
            data: issue
        })
    } catch (error) {
        console.log("Error occured while updating issue:", error);
        return res.status(500).json({
            success: false,
            message:"An unexpected error occured while processing your request"
        });
    };
};

const deleteIssue = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing issue ID"
            });
        }

        const issue = await Issue.findById(id);
 

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: 'No valid issue found'
            });
        }

        if (!issue.is_active) {
            return res.status(409).json({
                success: false,
                message: "Issue already deleted"
            });
        }

        issue.is_active = false;  // Soft delete by setting is_active to false
        await issue.save();

        return res.status(200).json({
            success: true,
            message: "Issue deleted successfully",
            data: issue
        });
    } catch (error) {
        console.log("Error occurred while deleting the issue:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while processing your request"
        });
    }
};

const reactivateIssues = async(req,res)=>{
    try {
        const {id} = req.params;

        const issue = await Issue.findById(id);

        if(issue.is_active){
            return res.status(409).json({
                success: false,
                message:"Issue already activated"
            });
        };

        issue.is_active = true;

        await issue.save();

        return res.status(200).json({
            success: true,
            message:"Issue reactivated successfully",
            data: issue
        });
    } catch (error) {
        console.log("Error occured while reactivating the issue:", error);
        return res.status(500).json({
            success: false,
            message:"An unexpected error occured while processing your request"
        });
    };
};

module.exports = {
    createIssue,
    getIssue,
    getIssueById,
    updateIssue,
    deleteIssue,
    reactivateIssues
}
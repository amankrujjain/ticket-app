
const Issue = require("../model/issueModel");
const {validationResult} = require("express-validator");

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

        const existingIssue = await Issue.findOne({name, is_active : true});

        if(existingIssue){
            return res.status(409).json({
                success: false,
                messgae:"Issue already exists"
            });
        };

        const newIssue = await new Issue({
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
                message:"Issues fetched successfully"
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
        
        const issue = await Issue.findOne(id);

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
        const name = req.body;

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

const deleteIssue = async(req,res)=>{
    try {
        const {id} = req.body;

        const issue = await Issue.findOne(id);

        if(!issue){
            return res.status(404).json({
                success: false,
                message:'No vaild issues were found'
            });
        };

        if(!issue.is_active){
            return res.status(409).json({
                success:false,
                message:"Issue alreday deleted"
            });
        };

        issue.is_active = false;
        await issue.save();

        return res.status(200).json({
            success: true,
            message:"Issue updated successfully",
            data: issue
        });
    } catch (error) {
        console.log("Error occured while updating issues:", error);
        return res.status(500).json({
            success: false,
            message:"An error occured while processing your request"
        });
    };
};

const reactivateIssues = async(req,res)=>{
    try {
        const {id} = req.body;

        const issue = await Issue.findOne(id);

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
const Ticket = require("../model/ticketModel");
const Reason = require("../model/reasonModel");
const Machine = require("../model/machineModel");
const { validationResult } = require("express-validator");
const Issue = require("../model/issueModel");
const Centre = require("../model/centreModel");

const createTicket = async (req, res) => {
    try {
        console.log("User object:", req.user);  // Debugging step

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array()
            });
        }

        const { description, issueId, reasonId, machineId, centre, created_on, status } = req.body;
        const userId = req.user?.id;  // Check if req.user is defined

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const issueObj = await Issue.findById(issueId);
        if (!issueObj) {
            return res.status(404).json({
                success: false,
                message: "Invalid issue provided"
            });
        }

        const reasonObj = await Reason.findById(reasonId);
        if (!reasonObj) {
            return res.status(404).json({
                success: false,
                message: "Invalid reason provided"
            });
        }

        const machineObj = await Machine.findById(machineId);
        if (!machineObj) {
            return res.status(404).json({
                success: false,
                message: "Invalid machine provided"
            });
        };

        const centreObj = await Centre.findById(centre)

        // Calculate the generatedDate based on tat and created_on
        
        // Create the new ticket
        const newTicket = new Ticket({
            description,
            issue: issueObj._id,
            reason: reasonObj._id,
            machine: machineObj._id,
            centre: centreObj._id,
            user:userId,
            status
        });
        
        const generatedDate = new Date(newTicket.created_on);
        newTicket.generatedDate = generatedDate.setDate(generatedDate.getDate() + reasonObj.tat);
        await newTicket.save();

        return res.status(201).json({
            success: true,
            message: "Ticket created successfully",
            data: newTicket
        });
    } catch (error) {
        console.log("Error occurred while creating the ticket:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred while creating the ticket"
        });
    }
};


const getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find()
            .populate("reason")
            .populate("machine")
            .populate("user")
            .populate("centre");  // Populate the center details

        return res.status(200).json({
            success: true,
            data: tickets
        });
    } catch (error) {
        console.log("Error occurred while fetching tickets:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred while fetching tickets"
        });
    }
};

const getTicketById = async(req,res)=>{
    try {
        const {id} = req.params;

        const ticket = await Ticket.findById(id)
        .populate("reason")
        .populate("machine")
        .populate("user")
        .populate("centre");

        if(!ticket){
            return res.status(404).json({
                success: false,
                message:"No valid ticket found"
            });
        };

        return res.status(200).json({
            success: true,
            data: ticket
        })
    } catch (error) {
        console.log("Error occured while searching ticket:", error.message);
        return res.status(500).json({
            success: true,
            message:"An unexpected error occured while processing your request"
        })
    }
}

const closeTicket = async (req, res) => {
    try {
        const { id } = req.params; // Assuming the ticket ID is passed as a URL parameter

        // Find the ticket by its ID
        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        if (ticket.status === "closed") {
            return res.status(409).json({
                success: false,
                message: "Ticket is already closed"
            });
        }

        // Update the ticket's status to "closed" and optionally set is_active to false
        ticket.status = "closed";
        ticket.is_active = false;
        await ticket.save();

        return res.status(200).json({
            success: true,
            message: "Ticket closed successfully",
            data: ticket
        });
    } catch (error) {
        console.log("Error occurred while closing the ticket:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred while closing the ticket"
        });
    }
};

module.exports = {
    createTicket,
    getTickets,
    getTicketById,
    closeTicket
};

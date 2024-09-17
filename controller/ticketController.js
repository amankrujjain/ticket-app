const mongoose = require('mongoose')

const Ticket = require("../model/ticketModel");
const Reason = require("../model/reasonModel");
const Machine = require("../model/machineModel");
const { validationResult } = require("express-validator");
const Issue = require("../model/issueModel");
const User = require('../model/userModel');
const Centre = require("../model/centreModel");
const stageModel = require('../model/stageModel');
const StageTracking = require('../model/stageTrackingModel')

const createTicket = async (req, res) => {
    try {
        console.log("User object from JWT:", req.user);

        // Fetch the full user object from the database
        const userId = req.user?.id;
        const user = await User.findById(userId)
            .populate({
                path: 'centre',
                populate: [
                    { path: 'state' },
                    { path: 'city' }
                ]
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const centreId = user.centre?._id;

        console.log("Centre ID from user:", centreId);

        if (!centreId) {
            return res.status(400).json({
                success: false,
                message: "User's centre is missing"
            });
        }

        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array()
            });
        }

        const { description, issueId, reasonId, machineId, created_on, status = "open" } = req.body;

        // Validate that IDs are valid MongoDB ObjectIds
        if (!mongoose.Types.ObjectId.isValid(issueId) || !mongoose.Types.ObjectId.isValid(reasonId) || !mongoose.Types.ObjectId.isValid(machineId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Issue, Reason, or Machine ID"
            });
        }

        // Fetch related objects from the database
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
        };

        // Find default stage
        const defaultStage = await stageModel.findOne({ stage_name: "raised" });
        if (!defaultStage) {
            return res.status(404).json({
                success: false,
                message: "Default stage not found"
            });
        }

        const machineObj = await Machine.findById(machineId);
        if (!machineObj) {
            return res.status(404).json({
                success: false,
                message: "Invalid machine provided"
            });
        }

        // Use the current date if created_on is not provided
        const ticketCreationDate = created_on ? new Date(created_on) : new Date();

        // Generate a unique ticket ID with "VC" prefix, day, and month
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const randomNum = Math.floor(10 + Math.random() * 90);
        const ticketId = `VC${day}${month}${randomNum}`;

        // Create the new ticket object
        const newTicket = new Ticket({
            description,
            ticket_id: ticketId,
            issue: issueObj._id,
            reason: reasonObj._id,
            machine: machineObj._id,
            centre: centreId,
            user: userId,
            status,
            stage: defaultStage._id,
            created_on: ticketCreationDate
        });

        // Calculate the generatedDate based on the reason's TAT
        newTicket.generatedDate = new Date(ticketCreationDate);
        newTicket.generatedDate.setDate(newTicket.generatedDate.getDate() + reasonObj.tat);

        // Save the new ticket to the database
        await newTicket.save();

        // Now create an initial stage tracking entry
        const stageTracking = new StageTracking({
            ticket: newTicket._id,
            stage: defaultStage._id,
            changed_by: userId,  // Assuming the user creating the ticket is the one who set the stage
            changed_on: new Date()  // Current date for stage change
        });

        // Save the stage tracking record
        await stageTracking.save();

        return res.status(201).json({
            success: true,
            message: "Ticket created successfully with initial stage tracking",
            data: {
                ticket: newTicket,
                stageTracking: stageTracking
            }
        });
    } catch (error) {
        console.log("Error occurred while creating the ticket:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred while creating the ticket",
            error: error.message
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
        .populate("issue")
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
            success: false,
            message:"An unexpected error occured while processing your request"
        })
    }
};

const getOpenTicketsForUser = async (req, res) => {
    try {
        // Fetch the user ID from the request body
        console.log(req.user)
        const userId = req.user?.id;
        console.log(userId)

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required to fetch tickets."
            });
        }

        // Fetch open tickets associated with the given user ID
        const openTickets = await Ticket.find({ user: userId, status: 'open' })
            .populate('issue')    // Populate issue details
            .populate('reason')   // Populate reason details
            .populate('machine')  // Populate machine details
            .populate('user')
            .populate({
                path: 'centre',
                populate: [
                    { path: 'state' },
                    { path: 'city' }
                ]
            })  // Populate center details
            .populate('stage')
               // Populate stage details
            .sort({created_on: -1})

        if (openTickets.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No open tickets found for the user."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Open tickets fetched successfully.",
            data: openTickets
        });
    } catch (error) {
        console.log("Error while fetching open tickets:", error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching open tickets."
        });
    }
};
const getClosedTicketsForUser = async (req, res) => {
    try {
        // Log user object to ensure it contains the correct user ID
        console.log("User Object:", req.user);

        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required to fetch tickets."
            });
        }

        // Log userId before querying the database
        console.log("Fetching closed tickets for user:", userId);

        // Fetch closed tickets associated with the user ID and log the query
        const closedTickets = await Ticket.find({ user: userId, status: 'closed' })
            .populate('issue')
            .populate('reason')
            .populate('machine')
            .populate('user')
            .populate({
                path: 'centre',
                populate: [
                    { path: 'state' },
                    { path: 'city' }
                ]
            })
            .populate('stage');

        // Log the result of the query to inspect the data returned
        console.log("Closed Tickets Found:", closedTickets);

        if (closedTickets.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No closed tickets found for the user."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Closed tickets fetched successfully.",
            data: closedTickets
        });
    } catch (error) {
        console.log("Error while fetching closed tickets:", error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching closed tickets."
        });
    }
};
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
    closeTicket,
    getOpenTicketsForUser,
    getClosedTicketsForUser
};

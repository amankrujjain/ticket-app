const Ticket = require("../model/ticketModel");
const Reason = require("../model/reasonModel");
const Machine = require("../model/machineModel");
const { validationResult } = require("express-validator");
const Issue = require("../model/issueModel");
const Centre = require("../model/centreModel");

const createTicket = async (req, res) => {
    try {
        // Log the user object for debugging
        console.log("User object:", req.user);

        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array()
            });
        }

        const { description, issueId, reasonId, machineId, created_on, status = "open" } = req.body; // Default description and status
        const userId = req.user?.id;  // Get the authenticated user ID
        const centreId = req.user?.centre?._id; // Get the center ID from user data

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
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

        // Create the new ticket object
        const newTicket = new Ticket({
            description,
            issue: issueObj._id,
            reason: reasonObj._id,
            machine: machineObj._id,
            centre: centreId,  // Use center from req.user
            user: userId,
            status,
            created_on: ticketCreationDate // Assign the created date
        });

        // Calculate the generatedDate based on the reason's TAT
        newTicket.generatedDate = new Date(ticketCreationDate);
        newTicket.generatedDate.setDate(newTicket.generatedDate.getDate() + reasonObj.tat);

        // Save the new ticket to the database
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
            .populate('stage');   // Populate stage details

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

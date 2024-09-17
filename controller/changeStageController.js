const mongoose = require('mongoose');
const StageTracking = require("../model/stageTrackingModel");
const Ticket = require("../model/ticketModel");
const Stage = require("../model/stageModel");
const User = require("../model/userModel");

const changeStage = async(req,res)=>{
    try {
        // Temporary mock user for testing, bypassing auth middleware (Remove this once auth is integrated)
        if (!req.user) {
          req.user = {
            _id: '66d830cd8e2171975e2107e9', // Replace with a valid engineer ObjectId
            role: { name: 'engineer' }       // Simulating the engineer's role
          };
        }
    
        const { ticket, stage, description, nextActionDate } = req.body;
        const engineerId = req.user._id;
    
        // Role-based authorization
        if (req.user.role.name !== 'engineer') {
          return res.status(403).json({
            success: false,
            message: "Only engineers are allowed to change stages"
          });
        }
    
        // Validate inputs
        if (!ticket || !stage) {
          return res.status(400).json({
            success: false,
            message: "Ticket ID and Stage ID are required"
          });
        }
    
        // Find the ticket
        const ticketId = await Ticket.findById(ticket);
        if (!ticketId) {
          return res.status(404).json({
            success: false,
            message: "Ticket not found"
          });
        }
    
        // Find the stage
        const stageId = await Stage.findById(stage);
        if (!stageId) {
          return res.status(404).json({
            success: false,
            message: "Stage not found"
          });
        }
    
        // Update ticket stage
        ticketId.stage = stageId._id;
        await ticketId.save();
    
        // Create new stage tracking entry
        const stageTracking = new StageTracking({
          ticket: ticketId._id,
          stage: stageId._id,
          changed_by: engineerId,
          description: description || '',    // Optional description
          next_action_date: nextActionDate || null, // Optional next action date
          changed_on: new Date()  // Set current date
        });
        await stageTracking.save();
    
        // Populate tracking data for response
        const populatedTracking = await StageTracking.findById(stageTracking._id)
          .populate('changed_by', 'name')
          .populate('stage', 'stage_name');  // Ensure to populate the correct field
    
        return res.status(200).json({
          success: true,
          message: "Stage changed successfully",
          data: populatedTracking
        });
    
      } catch (error) {
        console.log("Error while changing stage:", error.message);
    
        return res.status(500).json({
          success: false,
          message: `An error occurred while processing your request for ticket ${req.body.ticket}`
        });
      }
    };

// const StageTracking = require("../model/stageTrackingModel");

const getStageTracking = async (req, res) => {
    try {
        const { ticketId } = req.params;  // Optional: if you want to get tracking for a specific ticket

        console.log("receieved ticket id", ticketId)
        // Validate the ticketId if provided
        if (ticketId && !mongoose.Types.ObjectId.isValid(ticketId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ticket ID"
            });
        }

        let query = {};
        if (ticketId) {
            query.ticket = ticketId;  // Filter by ticket ID if provided
        }

        // Fetch the stage tracking data
        const trackingData = await StageTracking.find(query)
            .populate('ticket', 'description')  // Populate the ticket details (e.g., description)
            .populate('stage', 'stage_name')    // Populate the stage details (use stage_name if that's the field name)
            .populate('changed_by', 'name')     // Populate the engineer's name who made the change
            .sort({ changed_on: -1 });          // Sort by most recent stage change first

        console.log("Ticket data", trackingData);

        if (!trackingData || trackingData.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No stage tracking data found for the provided ticket"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Stage tracking data fetched successfully",
            data: trackingData
        });
    } catch (error) {
        console.log("Error while fetching stage tracking data:", error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching stage tracking data",
            error: error.message
        });
    }
};

const getStageTrackingByStatus = async (req, res) => {
    try {
        const { status } = req.query;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status query parameter is required"
            });
        }

        // Fetch the stage tracking data
        const trackingData = await StageTracking.find()
            .populate('ticket', 'description')  // Populate ticket details
            .populate('stage', 'name')          // Populate stage details
            .populate('changed_by', 'name');    // Populate engineer details

        console.log("Tracking data after population:", trackingData);  // Log entire tracking data

        // Filter the data with case-insensitive matching
        const filteredData = trackingData.filter(item => {
            if (item.stage) {
                console.log(`Comparing stage: ${item.stage.name} with status: ${status.trim()}`);  // Debugging log
            } else {
                console.log("Stage is undefined for this item:", item);  // Debug if stage is missing
            }
            return item.stage && new RegExp(`^${status.trim()}$`, 'i').test(item.stage.stage_name);
        });

        if (filteredData.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No stage tracking data found for status: ${status}`
            });
        }

        return res.status(200).json({
            success: true,
            message: "Stage tracking data fetched successfully",
            data: filteredData
        });
    } catch (error) {
        console.log("Error while fetching stage tracking by status:", error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching stage tracking data"
        });
    }
};

module.exports = {
    changeStage,
    getStageTracking,
    getStageTrackingByStatus
}
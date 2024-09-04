const StageTracking = require("../model/stageTrackingModel");
const Ticket = require("../model/ticketModel");
const Stage = require("../model/stageModel");
const User = require("../model/userModel");

const changeStage = async(req,res)=>{
    try {
        // Temporary mock user for testing, bypassing auth middleware
        if (!req.user) {
            req.user = {
                _id: '66d830cd8e2171975e2107e9',  // Replace with a valid engineer ObjectId
                role: { name: 'engineer' }  // Simulating the engineer's role
            };
        }
        const {ticket, stage} = req.body;
        const engineerId = req.user._id; 
        console.log(engineerId)

        if(req.user.role.name !== 'engineer'){
            return res.status(403).json({
                success: false,
                message:"Only engineers are allowed to change stages"
            });
        };

        const ticketId  = await Ticket.findById(ticket);
        console.log("Ticket ----->", ticket)
        const stageId = await Stage.findById(stage);
        console.log("Stage ----->", stage)


        if (!ticket || !stage) {
            return res.status(404).json({
                success: false,
                message: "Invalid ticket or stage"
            });
        };

        ticketId.stage = stageId._id;
        await ticketId.save();

        const stageTracking = new StageTracking({
            ticket: ticketId._id,
            stage: stageId._id,
            changed_by: engineerId,
            changed_on: new Date()
        });

        await stageTracking.save();

        const populatedTracking = await StageTracking.findById(stageTracking._id)
        .populate('changed_by', 'name')
        .populate('stage', 'name');

        return res.status(200).json({
            success: true,
            message: "Stage changed successfully",
            data: populatedTracking
        });

    } catch (error) {
        console.log("Error while changing stage:", error.message);

        return res.status(500).json({
            success: false,
            message:"An error occurred while processing your request"
        });
        
    };
};

// const StageTracking = require("../model/stageTrackingModel");

const getStageTracking = async (req, res) => {
    try {
        const { ticketId } = req.params;  // Optional: if you want to get tracking for a specific ticket

        let query = {};
        if (ticketId) {
            query.ticket = ticketId;  // Filter by ticket ID if provided
        }

        // Fetch the stage tracking data
        const trackingData = await StageTracking.find(query)
            .populate('ticket', 'description')  // Populate the ticket details
            .populate('stage', 'name')  // Populate the stage details
            .populate('changed_by', 'name');  // Populate the engineer details

        if (!trackingData || trackingData.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No stage tracking data found"
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
            message: "An error occurred while fetching stage tracking data"
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
            return item.stage && new RegExp(`^${status.trim()}$`, 'i').test(item.stage.name);
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
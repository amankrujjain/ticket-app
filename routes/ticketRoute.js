const express = require("express");
const { createTicket, getTickets, closeTicket, getTicketById, } = require("../controller/ticketController");
const { createTicketValidator } = require("../helpers/validate");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protect routes with the authMiddleware
router.post("/tickets",authMiddleware(), createTicketValidator, createTicket);
router.get("/tickets", getTickets);
router.get("/get-ticket/:id", getTicketById)
router.patch("/tickets/:id/close", authMiddleware, closeTicket); // New route to close a ticket

module.exports = router;
const express = require("express");
const { createTicket, getTickets, closeTicket, getTicketById,getOpenTicketsForUser,getClosedTicketsForUser } = require("../controller/ticketController");
const { createTicketValidator } = require("../helpers/validate");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protect routes with the authMiddleware
router.post("/create-tickets",authMiddleware(), createTicketValidator, createTicket);
router.get("/tickets", getTickets);
router.get("/get-ticket/:id", getTicketById);
router.post('/my-open-tickets', authMiddleware(), getOpenTicketsForUser);
router.post('/my-closed-tickets', authMiddleware(), getClosedTicketsForUser);
router.patch("/tickets/:id/close", authMiddleware(), closeTicket); // New route to close a ticket

module.exports = router;
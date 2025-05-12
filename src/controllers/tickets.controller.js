import { ticketsService } from '../services/tickets.service.js';
import { errorHandler, isValidObjectId } from '../utils.js';

export class TicketsController {
	//* Get all tickets ******************************/
	static async getTickets(req, res) {
		try {
			const tickets = await ticketsService.getTickets();

			// If no tickets, throw an error to be handled by the catch block
			if (!tickets || tickets.length === 0) {
				return res.status(404).json({
					error: true,
					message: 'No tickets found',
					payload: null,
				});
			}

			return res.status(200).json({
				error: false,
				message: 'Tickets retrieved successfully',
				payload: { tickets },
			});
		} catch (error) {
			console.error('❌ Error fetching tickets:', error.message);
			errorHandler(error, res);
		}
	}

	//* Get a ticket by ID ******************************/
	static async getTicket(req, res) {
		try {
			const ticketId = req.params.uid;

			if (!isValidObjectId(ticketId)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid ticket ID format',
					payload: null,
				});
			}

			// Find the ticket by ID
			const user = await ticketsService.getUser({ _id: userId });

			if (!user) {
				return res.status(404).json({
					error: true,
					message: 'Ticket not found',
					payload: null,
				});
			}

			return res.status(200).json({
				error: false,
				message: 'Ticket retrieved successfully',
				payload: { user },
			});
		} catch (error) {
			console.error('❌ Error fetching the ticket:', error.message);
			errorHandler(error, res);
		}
	}
}

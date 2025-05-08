import { TicketModel } from './models/tiquet.model.js';

export class TicketsDAOMongo {
	//* CREATE a new ticket *******************************************/
	static async create(ticket) {
		const newTicket = await TicketModel.create(ticket);
		return newTicket.toObject();
	}

	//* GET all tickets ***********************************************/
	static async get() {
		return await TicketModel.find().lean();
	}

	//* GET a ticket by filter ****************************************/
	static async getBy(filter) {
		return await TicketModel.findOne(filter).lean();
	}

	//* DELETE a ticket by ID *****************************************/
	static async delete(ticketId) {
		const ticket = await TicketModel.findByIdAndDelete(ticketId);
		return ticket ? ticket.toObject() : null;
	}
}

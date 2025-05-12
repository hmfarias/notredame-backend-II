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
	static async getBy(filter, populate = false) {
		let query = TicketModel.findOne(filter);
		if (populate) {
			query = query.populate('products.product', '_id title price thumbnail');
		}
		return await query.lean();
	}

	//* DELETE a ticket by ID *****************************************/
	static async delete(ticketId) {
		const ticket = await TicketModel.findByIdAndDelete(ticketId);
		return ticket ? ticket.toObject() : null;
	}
}

import { TicketsDAOMongo as TicketsDAO } from '../dao/TicketsDAOMongo.js';

class TicketsService {
	constructor(dao) {
		this.ticketsDAO = dao;
	}

	//* CREATE a new ticket *******************************************/
	async createTicket(ticketData) {
		return await this.ticketsDAO.create(ticketData);
	}

	//* GET a ticket by filter ****************************************/
	async getTicketByFilter(filter) {
		return await this.ticketsDAO.getBy(filter);
	}

	//* GET all tickets ***********************************************/
	async getTickets() {
		return await this.ticketsDAO.get();
	}

	//* DELETE a ticket ***********************************************/
	async deleteTicket(ticketId) {
		return await this.ticketsDAO.delete(ticketId);
	}
}

export const ticketsService = new TicketsService(TicketsDAO);

import { Router } from 'express';
import { passportCall } from '../utils.js';
import { authorisation } from '../middlewares/authorisation.js';
import { TicketsController } from '../controllers/tickets.controller.js';

export const router = Router();

//* GET ALL TICKETS **********************************************/
router.get(
	'/',
	passportCall('current'),
	authorisation(['admin']),
	TicketsController.getTickets
);

//* GET A TICKET BY ID **********************************************/
router.get(
	'/:tid',
	passportCall('current'),
	authorisation(['admin']),
	TicketsController.getTicket
);

//* CREATE A TICKET **********************************************/
// This is done in cart purchase

import { Router } from 'express';
import { passportCall } from '../utils.js';
import { authorisation } from '../middlewares/authorisation.js';
import { UsersController } from '../controllers/users.controller.js';

export const router = Router();

//* GET ALL USERS **********************************************/
router.get(
	'/',
	passportCall('current'),
	authorisation(['admin']),
	UsersController.getUsers
);

//* GET A USER BY ID **********************************************/
router.get(
	'/:uid',
	passportCall('current'),
	authorisation(['admin']),
	UsersController.getUser
);

//* CREATE A USER **********************************************/
// replaced by Passport Strategy

//* UPDATE A USER **********************************************/
router.put(
	'/:uid',
	passportCall('current'),
	authorisation(['public']),
	UsersController.updateUser
);

//* DELETE A USER **********************************************/
router.delete(
	'/:uid',
	passportCall('current'),
	authorisation(['admin']),
	UsersController.deleteUser
);

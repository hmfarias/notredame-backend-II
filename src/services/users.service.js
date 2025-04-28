import { UsersDAOMongo as UsersDAO } from '../dao/UsersDAOMongo.js';

class UsersService {
	constructor(dao) {
		this.usersDAO = dao;
	}
	//* Get all users ********************************/
	async getUsers() {
		return await UsersDAO.getAll();
	}

	//* Get a user by filter **************************/
	async getUser(filter) {
		return await UsersDAO.getBy(filter);
	}

	//* Create a user *******************************/ // Replaced by Passport Strategy

	//* Update a user by id **************************/
	async updateUser(id, user) {
		return await UsersDAO.update(id, user);
	}

	//* Delete a user by ID **************************/
	async deleteUser(userId) {
		return await UsersDAO.delete(userId);
	}
}
export const usersService = new UsersService(UsersDAO);

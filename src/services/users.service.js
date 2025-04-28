import { UsersDAOMongo as UsersDAO } from '../dao/UsersDAOMongo.js';

class UsersService {
	constructor(dao) {
		this.usersDAO = dao;
	}
	//* Get all users ********************************/
	async getUsers() {
		return await this.usersDAO.getAll();
	}

	//* Get a user by filter **************************/
	async getUser(filter) {
		return await this.usersDAO.getBy(filter);
	}

	//* Create a user *******************************/ // Replaced by Passport Strategy

	//* Update a user by id **************************/
	async updateUser(id, user) {
		return await this.usersDAO.update(id, user);
	}

	//* Delete a user by ID **************************/
	async deleteUser(userId) {
		return await this.usersDAO.delete(userId);
	}
}
export const usersService = new UsersService(UsersDAO);

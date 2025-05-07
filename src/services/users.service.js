import { UsersDAOMongo as UsersDAO } from '../dao/UsersDAOMongo.js';
import { UsersDTO } from '../dto/users.dto.js';

class UsersService {
	constructor(dao) {
		this.usersDAO = dao;
	}
	//* Get all users --------------------------------*/
	async getUsers() {
		const users = await this.usersDAO.getAll();
		return users ? UsersDTO.formatUserOutput(users) : null;
	}

	//* Get a user by filter --------------------------*/
	async getUser(filter) {
		const user = await this.usersDAO.getBy(filter);
		return user ? UsersDTO.formatUserOutput(user) : null;
	}

	//* Create a user ------------------------------- // Replaced by Passport Strategy

	//* Update a user by id ----------------------------*/
	async updateUser(id, user) {
		const userUpdated = await this.usersDAO.update(id, user);
		return userUpdated ? UsersDTO.formatUserOutput(userUpdated) : null;
	}

	//* Delete a user by ID ----------------------------*/
	async deleteUser(userId) {
		return await this.usersDAO.delete(userId);
	}
}
export const usersService = new UsersService(UsersDAO);

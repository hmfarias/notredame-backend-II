import { userModel } from './models/user.model.js';

export class UsersManagerMongo {
	static async create(user) {
		const newUser = await userModel.create(user);
		return newUser.toJSON();
	}

	static async getBy(filter) {
		return await userModel.findOne(filter).lean();
	}

	static async getAll() {
		const users = await userModel.find();
		return users.map((user) => user.toJSON());
	}
}

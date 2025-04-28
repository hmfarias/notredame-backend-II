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

	static async delete(userId) {
		const user = await userModel.findById(userId); // To trigger the middleware ‘pre’ in user.model.js need to find the user first
		await user.deleteOne(); // and naw delete it and trigger the middleware ‘pre’ in user.model.js when deleting the user
		return user;
	}
}

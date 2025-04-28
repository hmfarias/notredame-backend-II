import { userModel } from './models/user.model.js';

export class UsersDAOMongo {
	//* Get all users *******************************/
	static async getAll() {
		const users = await userModel.find();
		return users.map((user) => user.toJSON());
	}

	//* Get a user by Filter ************************/
	static async getBy(filter) {
		return await userModel.findOne(filter).lean();
	}

	//* Create a user ******************************/Replaced by Passport Strategy
	static async create(user) {
		const newUser = await userModel.create(user);
		return newUser.toJSON();
	}

	//* Update a user by ID ***********************/
	static async update(userId, user) {
		const updatedUser = await userModel.findOneAndUpdate(
			{ _id: userId },
			{ $set: user },
			{ new: true, lean: true }
		);
		return updatedUser;
	}

	//* Delete a user by ID ************************/
	static async delete(userId) {
		const user = await userModel.findById(userId); // To trigger the middleware ‘pre’ in user.model.js need to find the user first
		await user.deleteOne(); // and naw delete it and trigger the middleware ‘pre’ in user.model.js when deleting the user
		return user;
	}
}

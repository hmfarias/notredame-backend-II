import { UsersManagerMongo as UsersManager } from '../dao/UsersManagerMongo.js';
import { errorHandler, isValidObjectId } from '../utils.js';

export class UsersController {
	//* Get all users ******************************
	static async getUsers(req, res) {
		try {
			const users = await UsersManager.getAll();

			// If no users, throw an error to be handled by the catch block
			if (!users || users.length === 0) {
				return res.status(404).json({
					error: true,
					message: 'No users found',
					payload: null,
				});
			}

			// Remove the password field before sending
			const safeUsers = users.map((user) => {
				const { password, ...safeUser } = user;
				return safeUser;
			});

			return res.status(200).json({
				error: false,
				message: 'Users retrieved successfully',
				payload: { users: safeUsers },
			});
		} catch (error) {
			console.error('❌ Error fetching users:', error.message);
			errorHandler(error, res);
		}
	}

	//* Get a user by ID ******************************
	static async getUser(req, res) {
		try {
			const userId = req.params.uid;

			if (!isValidObjectId(userId)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid user ID format',
					payload: null,
				});
			}

			// Find the user by ID
			const user = await UsersManager.getBy({ _id: userId });

			if (!user) {
				return res.status(404).json({
					error: true,
					message: 'User not found',
					payload: null,
				});
			}

			// Remove sensitive fields
			const { password, ...safeUser } = user;

			return res.status(200).json({
				error: false,
				message: 'User retrieved successfully',
				payload: { user: safeUser },
			});
		} catch (error) {
			console.error('❌ Error fetching the user:', error.message);
			errorHandler(error, res);
		}
	}

	//* Delete a user by ID ******************************
	static async deleteUser(req, res) {
		try {
			const userId = req.params.uid;

			// Validate ObjectId format
			if (!isValidObjectId(userId)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid user ID format',
					payload: null,
				});
			}

			// Find the user first
			const user = await UsersManager.getBy({ _id: userId });

			if (!user) {
				return res.status(404).json({
					error: true,
					message: 'User not found',
					payload: null,
				});
			}

			// Delete the user
			await UsersManager.delete(userId);

			// Return the user that was deleted (excluding sensitive data)
			const { password, ...safeUser } = user;

			return res.status(200).json({
				error: false,
				message: 'User deleted successfully',
				payload: { user: safeUser },
			});
		} catch (error) {
			console.error('❌ Error deleting user:', error.message);
			errorHandler(error, res);
		}
	}
}

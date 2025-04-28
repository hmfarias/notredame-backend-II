import { usersService } from '../services/users.service.js';
import { errorHandler, hashPassword, isValidObjectId } from '../utils.js';

export class UsersController {
	//* Get all users ******************************/
	static async getUsers(req, res) {
		try {
			const users = await usersService.getUsers();

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

	//* Get a user by ID ******************************/
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
			const user = await usersService.getUser({ _id: userId });

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

	//* Update a user by ID ******************************/
	static async updateUser(req, res) {
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
			const user = await usersService.getUser({ _id: userId });

			if (!user) {
				return res.status(404).json({
					error: true,
					message: 'User not found',
					payload: null,
				});
			}

			// Extract fields to update
			const { first_name, last_name, age, email, password } = req.body;

			const updateFields = {};

			if (first_name) updateFields.first_name = first_name.trim();
			if (last_name) updateFields.last_name = last_name.trim();
			if (typeof age !== 'undefined') {
				const parsedAge = parseInt(age, 10);
				if (isNaN(parsedAge) || parsedAge <= 0) {
					return res.status(400).json({
						error: true,
						message: 'Age must be a positive integer',
						payload: null,
					});
				}
				updateFields.age = parsedAge;
			}
			if (email) updateFields.email = email.trim().toLowerCase();

			// If password is provided, hash it
			if (password) {
				if (password.length < 3) {
					return res.status(400).json({
						error: true,
						message: 'Password must be at least 3 characters long',
						payload: null,
					});
				}
				if (typeof password !== 'string') {
					return res.status(400).json({
						error: true,
						message: 'Password must be a string',
						payload: null,
					});
				}
				updateFields.password = await hashPassword(password);
			}

			// Check if at least one field to update was provided
			if (Object.keys(updateFields).length === 0) {
				return res.status(400).json({
					error: true,
					message: 'No valid fields provided for update',
					payload: null,
				});
			}

			// Update the user
			const updatedUser = await usersService.updateUser({ _id: userId }, updateFields);

			if (!updatedUser) {
				return res.status(400).json({
					error: true,
					message:
						'Failed to update user - The user may not exist or there was an issue with the request',
					payload: null,
				});
			}

			// Return the updated user without password
			const { password: _, ...safeUser } = updatedUser;

			return res.status(200).json({
				error: false,
				message: 'User updated successfully',
				payload: { user: safeUser },
			});
		} catch (error) {
			console.error('❌ Error updating user:', error.message);
			errorHandler(error, res);
		}
	}

	//* Delete a user by ID ******************************/
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
			const user = await usersService.getUser({ _id: userId });

			if (!user) {
				return res.status(404).json({
					error: true,
					message: 'User not found',
					payload: null,
				});
			}

			// Delete the user
			await usersService.deleteUser(userId);

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

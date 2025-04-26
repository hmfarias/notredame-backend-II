import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { errorHandler, isValidObjectId, passportCall } from '../utils.js';
import { UsersManagerMongo as UsersManager } from '../dao/UsersManagerMongo.js';
import { authorisation } from '../middlewares/authorisation.js';

export const router = Router();

//* Register - Local Strategy *****************************************
router.post('/register', passportCall('register'), async (req, res) => {
	try {
		const { user } = req;
		if (!user) {
			return res.status(400).json({
				error: true,
				message: 'User registration failed',
				payload: null,
			});
		}

		// Destructure to exclude sensitive fields like password
		const { password, ...safeUser } = user;

		return res.status(201).json({
			error: false,
			message: 'User created successfully',
			payload: safeUser,
		});
	} catch (error) {
		errorHandler(error, res);
	}
});

//* Login - Local Strategy **********************************************
router.post('/login', passportCall('login'), async (req, res) => {
	try {
		const user = req.user;

		if (!user) {
			return res.status(401).json({
				error: true,
				message: 'Authentication failed',
				payload: null,
			});
		}

		// Safely extract user without password
		const { password, ...safeUser } = user;

		// Generate JWT token
		const token = jwt.sign(safeUser, config.SECRET_KEY, {
			expiresIn: '30m',
		});

		// Set JWT token in cookie
		res.cookie('token', token, {
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 1000 * 60 * 60 * 24, //one day max duration
		});

		return res.status(200).json({
			error: false,
			message: 'Successful login',
			payload: { user: safeUser },
		});
	} catch (error) {
		errorHandler(error, res);
	}
});

//* Current - ******************************************
// passport.authenticate('current', { session: false }),
router.get('/current', passportCall('current'), (req, res) => {
	const { user } = req;

	if (!user) {
		return res.status(401).json({
			error: true,
			message: 'No authenticated user found',
			payload: null,
		});
	}

	// remove password field
	const { password, ...safeUser } = user;

	// clean cart structure
	const safeCart = safeUser.cart
		? {
				_id: safeUser.cart._id,
				totalCart: safeUser.cart.totalCart,
				products:
					safeUser.cart.products?.map((p) => ({
						_id: p?.product?._id,
						title: p?.product?.title,
						price: p?.product?.price,
						thumbnail: p?.product?.thumbnail,
					})) ?? [],
		  }
		: null;

	return res.status(200).json({
		error: false,
		message: 'Authenticated user',
		payload: {
			user: {
				...safeUser,
				cart: safeCart,
			},
		},
	});
});

router.post('/logout', (req, res) => {
	res.clearCookie('token');
	res.status(200).json({ error: false, message: 'Logout successful', payload: null });
});

//* Error -  *****************************************
router.get('/error', (req, res) => {
	return res.status(401).json({
		error: true,
		message: 'Operation error',
		payload: null,
	});
});

//* GET ALL USERS **********************************************/
router.get('/', passportCall('current'), authorisation(['admin']), async (req, res) => {
	try {
		const users = await UsersManager.getAll();
		if (!users || users.length === 0) {
			res.setHeader('Content-Type', 'application/json');
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

		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({
			error: false,
			message: 'Users retrieved successfully',
			payload: { users: safeUsers },
		});
	} catch (error) {
		console.error('❌ Error fetching users:', error.message);
		errorHandler(error, res);
	}
});

//* GET A USER BY ID **********************************************/
router.get('/:uid', async (req, res) => {
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
			res.setHeader('Content-Type', 'application/json');
			return res.status(404).json({
				error: true,
				message: 'User not found - The user with the specified ID does not exist',
				payload: null,
			});
		}

		// Remove sensitive fields
		const { password, ...safeUser } = user;

		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({
			error: false,
			message: 'User retrieved successfully',
			payload: { user: safeUser },
		});
	} catch (error) {
		console.error('❌ Error fetching the user:', error.message);
		errorHandler(error, res);
	}
});

//* DELETE A USER **********************************************/
router.delete(
	'/:uid',
	passportCall('current'),
	authorisation(['admin']),
	async (req, res) => {
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
);

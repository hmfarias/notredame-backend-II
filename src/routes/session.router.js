import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { errorHandler, passportCall } from '../utils.js';
import { UsersManagerMongo as UsersManager } from '../dao/UsersManagerMongo.js';

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
			expiresIn: '10m',
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

	// Format the user to be returned
	const safeUser = {
		_id: user._id,
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email,
		age: user.age,
		role: user.role,
		cart: {
			_id: user.cart?._id,
			totalCart: user.cart?.totalCart,
			products:
				user.cart?.products?.map((p) => ({
					_id: p?.product?._id,
					title: p?.product?.title,
					price: p?.product?.price,
					thumbnail: p?.product?.thumbnail,
				})) ?? [],
		},
	};

	return res.status(200).json({
		error: false,
		message: 'Authenticated user',
		payload: { user: safeUser },
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

//* GET A USER BY ID **********************************************/
router.get('/:uid', async (req, res) => {
	try {
		const userId = req.params.uid;

		// verify that the ID has valid format
		if (!userId) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(400).json({
				error: true,
				message: 'Invalid user ID format',
				payload: null,
			});
		}

		const user = await UsersManager.getBy({ _id: userId });
		if (!user) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(404).json({
				error: true,
				message: 'User not found - The user with the specified ID does not exist',
				payload: null,
			});
		}

		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({
			error: false,
			message: 'User retrieved successfully',
			payload: { user },
		});
	} catch (error) {
		console.error('❌ Error fetching the user:', error.message);
		errorHandler(error, res);
	}
});

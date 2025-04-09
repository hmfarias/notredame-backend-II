import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { errorHandler, passportCall } from '../utils.js';

export const router = Router();

// Register - Local Strategy ------------------------------------------
// passport.authenticate('register', { session: false }),
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

// passport.authenticate('login', {
// 	session: false,
// 	// failureRedirect: '/api/sessions/error',
// }),
// Login - Local Strategy ---------------------------------------------
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
			payload: safeUser,
		});
	} catch (error) {
		errorHandler(error, res);
	}
});

// Current -  ---------------------------------------------------------
// passport.authenticate('current', { session: false }),
router.get('/current', passportCall('current'), (req, res) => {
	const { user } = req;

	return res.status(200).json({
		error: false,
		message: 'Authenticated user',
		payload: user,
	});
});

router.post('/logout', (req, res) => {
	res.clearCookie('token');
	res.status(200).json({ error: false, message: 'Logout successful', payload: null });
});

// Error -  -----------------------------------------------------------
router.get('/error', (req, res) => {
	return res.status(401).json({
		error: true,
		message: 'Operation error',
		payload: null,
	});
});

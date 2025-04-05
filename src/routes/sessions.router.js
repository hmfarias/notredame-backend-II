import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { errorHandler } from '../utils.js';
import { auth } from '../middlewares/auth.js';

export const router = Router();

// Register - Local Strategy ---------------------------------------------------------
router.post(
	'/register',
	passport.authenticate('register', { session: false }),
	async (req, res) => {
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
	}
);

// Login - Local Strategy ---------------------------------------------------------
router.post(
	'/login',
	passport.authenticate('login', {
		session: false,
		failureRedirect: '/api/sessions/error',
	}),
	async (req, res) => {
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

			return res.status(200).json({
				error: false,
				message: 'Successful login',
				payload: safeUser,
				token,
			});
		} catch (error) {
			errorHandler(error, req, res);
		}
	}
);

// Error -  ---------------------------------------------------------
router.get('/error', (req, res) => {
	return res.status(401).json({
		error: true,
		message: 'Operation error',
		payload: null,
	});
});

// Current -  ---------------------------------------------------------
router.get('/current', auth, (req, res) => {
	const { user } = req;

	return res.status(200).json({
		error: false,
		message: 'Authenticated user',
		payload: user,
	});
});

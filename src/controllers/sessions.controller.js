import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { errorHandler } from '../utils.js';
import { UsersDTO } from '../dto/users.dto.js';

export class SessionsController {
	//* Register - Local Strategy *************************************************
	static async register(req, res) {
		try {
			const { user } = req;
			if (!user) {
				return res.status(400).json({
					error: true,
					message: 'User registration failed',
					payload: null,
				});
			}
			const safeUser = UsersDTO.formatUserOutput(user);

			return res.status(201).json({
				error: false,
				message: 'User created successfully',
				payload: safeUser,
			});
		} catch (error) {
			errorHandler(error, res);
		}
	}

	//* Login - Local Strategy ****************************************************
	static async login(req, res) {
		try {
			const user = req.user;

			if (!user) {
				return res.status(401).json({
					error: true,
					message: 'Authentication failed',
					payload: null,
				});
			}

			const safeUser = UsersDTO.formatUserOutput(user);

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
	}

	//* Current - *****************************************************************
	static async current(req, res) {
		const { user } = req;

		if (!user) {
			return res.status(401).json({
				error: true,
				message: 'No authenticated user found',
				payload: null,
			});
		}

		const safeUser = UsersDTO.formatUserOutput(user);

		return res.status(200).json({
			error: false,
			message: 'Authenticated user',
			payload: {
				user: {
					...safeUser,
					cart: safeUser.cart,
				},
			},
		});
	}

	//* Logout - ******************************************************************
	static async logout(req, res) {
		res.clearCookie('token');
		res.status(200).json({ error: false, message: 'Logout successful', payload: null });
	}
	//* Error -  *****************************************************************
	static async error(req, res) {
		return res.status(401).json({
			error: true,
			message: 'Operation error',
			payload: null,
		});
	}
}

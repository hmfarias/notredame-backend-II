import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const auth = (req, res, next) => {
	if (!req.cookies.token) {
		return res.status(401).json({
			error: true,
			message: 'Unauthorized',
			payload: null,
		});
	}

	// Extract token from the cookie
	const token = req.cookies.token;

	try {
		// Verify token
		const decodedUser = jwt.verify(token, config.SECRET_KEY);
		req.user = decodedUser;
		next();
	} catch (err) {
		return res.status(401).json({
			error: true,
			message: 'Unauthorized',
			payload: null,
		});
	}
};

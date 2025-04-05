import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const auth = (req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(401).json({
			error: true,
			message: 'Authorization token missing - No user logged in',
			payload: null,
		});
	}

	const token = req.headers.authorization.split(' ')[1];

	try {
		const decodedUser = jwt.verify(token, config.SECRET_KEY);
		req.user = decodedUser;
		next();
	} catch (err) {
		return res.status(401).json({
			error: true,
			message: 'Invalid or expired token',
			payload: null,
		});
	}
};

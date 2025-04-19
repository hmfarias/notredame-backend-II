import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

// To hash the password
export const hashPassword = async (password) =>
	bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// To compare the password
export const comparePassword = async (password, hash) =>
	bcrypt.compareSync(password, hash);

// Error handler
export const errorHandler = (error, res) => {
	const now = new Date();
	const today = now.toISOString().split('T')[0];
	const logPath = path.join(__dirname, 'logs', `${today}.log`);

	const logEntry = {
		timestamp: now.toISOString(),
		message: error.message,
		stack: error.stack,
	};

	// Ensure the logs directory exists
	fs.mkdirSync(path.dirname(logPath), { recursive: true });

	const logs = fs.existsSync(logPath)
		? JSON.parse(fs.readFileSync(logPath, 'utf-8') || '[]')
		: [];

	logs.push(logEntry);
	fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));

	// Send the response
	res.status(500).json({
		error: true,
		message: 'Unexpected server error - Try later or contact your administrator',
		payload: null,
	});
};

export const passportCall = (strategy) => {
	return function (req, res, next) {
		passport.authenticate(strategy, function (err, user, info, status) {
			// console.log('✅ ~ info:', info);

			if (err) {
				return next(err); //when passport.config returns donde(error) - (error and user is not logged)
			}
			if (!user) {
				//when passport.config returns donde(null,false) - (no error and user is not logged)
				res.setHeader('Content-Type', 'application/json');
				return res.status(400).json({
					error: true,
					message: `${info.message ? info.message : info.toString()}`,
					payload: null,
				});
			}
			//when passport.config returns donde(null,user) - (no error and user is logged)
			req.user = user;
			return next();
		})(req, res, next);
	};
};

// verify if and ID has valid format
export const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// round to two decimals
export const roundToTwoDecimals = (value) => {
	return Number(value.toFixed(2));
};

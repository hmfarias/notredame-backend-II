import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

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

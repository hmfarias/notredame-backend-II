import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

// To hash the password
export const hashPassword = async (password) =>
	bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// To compare the password
export const comparePassword = async (password, hash) =>
	bcrypt.compareSync(password, hash);

//
const path = './src/logs/error.log';
export const errorHandler = (error, res) => {
	const data = {
		fecha: new Date(),
		error: error.message,
		detalle: error.stack,
	};
	let logs;
	if (fs.existsSync(path)) {
		logs = JSON.parse(fs.readFileSync(path, 'utf-8'));
	} else {
		logs = [];
	}
	logs.push(data);
	fs.writeFileSync(path, JSON.stringify(logs, null, 5));
	res.setHeader('Content-Type', 'application/json');
	return res.status(500).json({
		error: true,
		message: `Unexpected server error - Try later, or contact your administrator`,
		// detalle:`${error.message}`
		payload: null,
	});
};

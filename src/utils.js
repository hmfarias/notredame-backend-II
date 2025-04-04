import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

// To hash the password
export const hashPassword = async (password) =>
	bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// To compare the password
export const comparePassword = async (password, hash) =>
	bcrypt.compareSync(password, hash);

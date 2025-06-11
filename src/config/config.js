// Import dotenv and initialize environment variables
import dotenv from 'dotenv';
import { Command } from 'commander';
import __dirname from '../utils.js';
import path from 'path';

// Load .env file from the root
// Use __dirname to be shure that the path is correct independently of the level from which the app is called
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true }); // Load the .env file

// Initialize Commander
const program = new Command();
program
	.option('-p, --port <port>', 'Set the server port') // Optional command-line argument
	.parse(process.argv);

// Get the CLI options
const options = program.opts();

// Export the config object with fallback priority: CLI > .env > default
export const config = {
	//App
	PORT: options.port || process.env.PORT || 8080,
	NODE_ENV: process.env.NODE_ENV || 'development',
	SECRET_KEY: process.env.SECRET_KEY,

	//Database
	DB_NAME: process.env.DB_NAME,
	MONGODB_URI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=${process.env.APP_NAME}`,

	//CORS
	FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

	// OAuth
	GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
	GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
};

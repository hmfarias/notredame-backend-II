//import dotenv and initialize environment variables
import dotenv from 'dotenv';
dotenv.config(); //load the .env file

export const config = {
	PORT: process.env.PORT || 3000,
	DB_NAME: process.env.DB_NAME,
	MONGODB_URI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=${process.env.APP_NAME}`,
	SECRET_KEY: process.env.SECRET_KEY,
	GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
};

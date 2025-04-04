import express from 'express';
import __dirname from './utils.js';
import path from 'path';
import { engine } from 'express-handlebars';
import { connectDB } from './config/configDB.js';
import { config } from './config/config.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, './views'));

connectDB();

const server = app.listen(config.PORT, () => {
	console.log(`Server is running on port ${config.PORT}`);
});

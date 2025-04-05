import express from 'express';
import __dirname from './utils.js';
import path from 'path';
import { engine } from 'express-handlebars';
import { connectDB } from './config/configDB.js';
import { config } from './config/config.js';
import { router as sessionsRouter } from './routes/sessions.router.js';
import { router as viewsRouter } from './routes/views.router.js';

// Passport
import passport from 'passport';
import { initPassport } from './config/configPassport.js';

// app initialization
const app = express();

// app middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));

// init passport
initPassport();
app.use(passport.initialize());

// handlebars engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, './views'));

// routes
app.use('/', viewsRouter);
app.use('/api/sessions', sessionsRouter);

//connect to the database
connectDB();

// start the server
const server = app.listen(config.PORT, () => {
	console.log(`Server is running on port ${config.PORT}`);
});

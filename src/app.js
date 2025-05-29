import express from 'express';
import cors from 'cors';
import __dirname from './utils.js';
import path from 'path';
import { engine } from 'express-handlebars';
import { connectDB } from './config/database.config.js';
import { config } from './config/config.js';
import { router as sessionsRouter } from './routes/sessions.router.js';
import { router as usersRouter } from './routes/users.router.js';
import { router as viewsRouter } from './routes/views.router.js';
import { router as productsRouter } from './routes/products.router.js';
import { router as cartRouter } from './routes/carts.router.js';
import { router as ticketsRouter } from './routes/tickets.router.js';
import { router as categoriesRouter } from './routes/categories.router.js';

import cookieParser from 'cookie-parser';

// STEP 2-1 - IMPORT Passport ******************
import passport from 'passport';
import { initPassport } from './config/passport.config.js';
// END STEP 2-1 - IMPORT Passport **************

// app initialization
const app = express();

// app middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));
app.use(cookieParser());

// STEP 2-2 - INIT Passport *******************
initPassport();
app.use(passport.initialize());
// END STEP 2-2 - INIT Passport ***************

// handlebars engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, './views'));

// routes
app.use('/', viewsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/categories', categoriesRouter);

//connect to the database
await connectDB();

// start the server
const server = app.listen(config.PORT, () => {
	console.log(`Server is running on port ${config.PORT} - DB: ${config.DB_NAME}`);
});

import passport from 'passport';
import local from 'passport-local';
import { UsersManagerMongo as UsersManager } from '../dao/UsersManagerMongo.js';
import { comparePassword, hashPassword } from '../utils.js';
import { config } from './config.js';

export const initPassport = () => {
	// Local Strategy ---------------------------------------------------------------------------------
	// Register
	passport.use(
		'register',
		new local.Strategy(
			{ usernameField: 'email', passReqToCallback: true },
			async (req, username, password, done) => {
				const { first_name, last_name, age, role } = req.body;

				if (!first_name || !last_name || !age || !password) {
					console.log('Error: Missing fields');
					return done(null, false);
				}

				try {
					const exists = await UsersManager.getBy({ email: username });
					if (exists) {
						console.log('Error: User already exists');
						return done(null, false);
					}

					const hashedPassword = await hashPassword(password);

					const user = await UsersManager.create({
						first_name,
						last_name,
						email: username,
						age,
						password: hashedPassword,
						role,
					});
					return done(null, user);
				} catch (error) {
					return done(error);
				}
			}
		)
	);

	// Local Strategy ---------------------------------------------------------------------------------
	// Login
	passport.use(
		'login',
		new local.Strategy({ usernameField: 'email' }, async (username, password, done) => {
			try {
				const user = await UsersManager.getBy({ email: username });
				if (!user) {
					console.log('Error: Invalid credentials');
					return done(null, false);
				}

				if (!(await comparePassword(password, user.password))) {
					console.log('Error: Invalid credentials');
					return done(null, false);
				}

				return done(null, user);
			} catch (error) {
				return done(error);
			}
		})
	);

	//Save in session ----------------------------------------------------------------
	//Only if using sessions
	// passport.serializeUser((user, done) => {
	// 	return done(null, user._id);
	// });

	//Recover from session--------------------------------------------------------------
	//Only if using sessions
	// passport.deserializeUser(async (id, done) => {
	// 	const user = await UsersManager.getBy({ _id: id });
	// 	return done(null, user);
	// });
};

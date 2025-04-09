import passport from 'passport';
import passportJWT from 'passport-jwt';
import local from 'passport-local';
import { UsersManagerMongo as UsersManager } from '../dao/UsersManagerMongo.js';
import { comparePassword, hashPassword } from '../utils.js';
import { config } from './config.js';

export const initPassport = () => {
	// Local Strategy ---------------------------------------------------------------------------------
	// Register
	// STEP 1 *****************************
	passport.use(
		'register',
		new local.Strategy(
			{ usernameField: 'email', passReqToCallback: true },
			async (req, username, password, done) => {
				const { first_name, last_name, age, role } = req.body;

				if (!first_name || !last_name || !age || !password) {
					return done(null, false, { message: 'Missing fields' });
				}

				try {
					const exists = await UsersManager.getBy({ email: username });
					if (exists) {
						return done(null, false, { message: 'User already exists' });
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
					return done(null, user, { message: 'User created successfully' });
				} catch (error) {
					return done(error);
				}
			}
		)
	);
	// END STEP 1 *************************

	// Local Strategy ---------------------------------------------------------------------------------
	// Login
	// STEP 1 *****************************
	passport.use(
		'login',
		new local.Strategy({ usernameField: 'email' }, async (username, password, done) => {
			try {
				const user = await UsersManager.getBy({ email: username });
				if (!user) {
					return done(null, false, { message: 'Invalid credentials' }); // no error - user is not logged
				}

				if (!(await comparePassword(password, user.password))) {
					return done(null, false, { message: 'Invalid credentials' }); // no error - user is not logged
				}

				return done(null, user); // no error - user is logged
			} catch (error) {
				return done(error);
			}
		})
	);
	// END STEP 1 *************************

	// JWT Strategy ---------------------------------------------------------------------------------

	// cookieExtractor is a function that takes a request and returns the token from the cookie if exists
	const cookieExtractor = (req) => req.cookies?.token ?? null;

	// STEP 1 *****************************
	passport.use(
		'current',
		new passportJWT.Strategy(
			{
				secretOrKey: config.SECRET_KEY,
				jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([cookieExtractor]),
			},
			async (tokenContent, done) => {
				try {
					return done(null, tokenContent);
				} catch (error) {
					return done(error);
				}
			}
		)
	);
	// END STEP 1 *************************

	//STEP 1'(ONLY IF USING SESSIONS)*****
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
	// END STEP 1'************************
};

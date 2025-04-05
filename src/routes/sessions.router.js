import { Router } from 'express';
import passport from 'passport';

export const router = Router();

// Register - Local Strategy ---------------------------------------------------------
router.post(
	'/register',
	passport.authenticate('register', { session: false }),
	async (req, res) => {
		delete req.user.password; //Eliminate all confidential or sensitive data prior to showing it

		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({
			error: false,
			message: 'User created successfully',
			payload: req.user,
			token: null,
		});
	}
);

// Login - Local Strategy ---------------------------------------------------------
router.post(
	'/login',
	passport.authenticate('login', {
		session: false,
		failureRedirect: '/api/sessions/error',
	}),
	async (req, res) => {
		let user = req.user;
		delete user.password; //Eliminate all confidential or sensitive data prior to showing it
		// let token = jwt.sign(usuario, config.SECRET, { expiresIn: 60 * 10 });
		const token = 'asdfasdf';

		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({
			error: false,
			message: 'Successful login',
			payload: user,
			token,
		});
	}
);

// Error -  ---------------------------------------------------------
router.get('/error', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	return res.status(401).json({ error: `Error en la operación` });
});

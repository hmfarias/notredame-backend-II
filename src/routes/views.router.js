import { Router } from 'express';
export const router = Router();

router.get('/', (req, res) => {
	res.status(200).render('home', { title: 'Home Page' });
});

router.get('/register', (req, res) => {
	res.status(200).render('register', { title: 'Register User' });
});
router.get('/login', (req, res) => {
	res.status(200).render('login', { title: 'Login' });
});

router.get('/current', (req, res) => {
	res.status(200).render('current', { title: 'Current User' });
});

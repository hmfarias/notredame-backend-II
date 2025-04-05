import { Router } from 'express';
export const router = Router();

router.get('/', (req, res) => {
	res.status(200).render('home', { title: 'Home Page' });
});

router.get('/perfil', (req, res) => {
	res.status(200).render('perfil', { title: 'Perfil', user: req.session.user });
});

router.get('/login', (req, res) => {
	res.status(200).render('login', { title: 'Login' });
});

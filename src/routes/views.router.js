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
	res.status(200).render('current', { title: 'User Profile' });
});

router.get('/products', (req, res) => {
	res.render('products', { title: 'Products List' });
});

router.get('/product', (req, res) => {
	res.render('product', { title: 'Product Detail' });
});

router.get('/carts/:cid', (req, res) => {
	res.render('cart', { title: 'Your Cart' });
});

router.get('/products/updateProduct/:cid', (req, res) => {
	res.render('updateProduct', { title: 'Update Product' });
});

router.get('/newProduct', (req, res) => {
	res.render('newProduct', { title: 'Add New Product' });
});

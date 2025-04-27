import { Router } from 'express';
import { uploader } from '../utilsMulter.js';
import { passportCall } from '../utils.js';
import { authorisation } from '../middlewares/authorisation.js';
import { ProductsController } from '../controllers/products.controller.js';

export const router = Router();

//* GET all product  ********************************************/
router.get('/', ProductsController.getProducts);

//* GET a product by id *****************************************/
router.get('/:id', ProductsController.getProduct);

//* CREATE a new product ****************************************/
router.post(
	'/',
	uploader.single('file'),
	passportCall('current'),
	authorisation(['admin']),
	ProductsController.createProduct
);

//* UPDATE a product by id *************************************/
router.put(
	'/:id',
	uploader.single('file'),
	passportCall('current'),
	authorisation(['admin']),
	ProductsController.updateProduct
);

//* DELETE *****************************************************/
router.delete(
	'/:id',
	passportCall('current'),
	authorisation(['admin']),
	ProductsController.deleteProduct
);

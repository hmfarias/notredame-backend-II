import { Router } from 'express';
import { uploader } from '../utilsMulter.js';
import { passportCall } from '../utils.js';
import { authorisation } from '../middlewares/authorisation.js';
import { CategoriesController } from '../controllers/categories.controller.js';

export const router = Router();

//* GET all CATEGORIES *****************************************/
router.get('/', CategoriesController.getCategories);

//* GET a category by id *****************************************/
router.get('/:id', CategoriesController.getCategory);

//* CREATE a new category ****************************************/
router.post(
	'/',
	passportCall('current'),
	authorisation(['admin']),
	CategoriesController.createCategory
);

//* UPDATE a category by id *************************************/
router.put(
	'/:id',
	uploader.single('file'),
	passportCall('current'),
	authorisation(['admin']),
	CategoriesController.updateCategory
);

//* DELETE *****************************************************/
router.delete(
	'/:id',
	passportCall('current'),
	authorisation(['admin']),
	CategoriesController.deleteCategory
);

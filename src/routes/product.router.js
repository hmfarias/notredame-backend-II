import { Router } from 'express';
import { uploader } from '../utilsMulter.js';
import { ProductsManagerMongo as ProductsManager } from '../dao/ProductsManagerMongo.js';
import { errorHandler, isValidObjectId } from '../utils.js';

export const router = Router();

//* GET all product  **********************************************/
router.get('/', async (req, res) => {
	try {
		const { category, status, priceOrder, page = 1, limit = 10 } = req.query;

		// Validate Priceorder (just accept 'asc' or 'desc')
		const validPriceOrder = ['asc', 'desc'];
		if (priceOrder && !validPriceOrder.includes(priceOrder)) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(400).json({
				error: true,
				message: 'Invalid value for priceOrder. Use "asc" or "desc".',
				payload: null,
			});
		}

		// transform the page and limit to integer
		const pagenumber = parseInt(page, 10) || 1;
		const limitNumber = parseInt(limit, 10) || 10;

		//Call the get() method with filtering and pagination parameters
		const result = await ProductsManager.get({
			category,
			status,
			priceOrder,
			page: pagenumber,
			limit: limitNumber,
		});
		if (!result || result.length === 0) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(404).json({
				message: 'No products found',
				error: true,
				payload: null,
			});
		}

		// Build the base url with filters
		const params = new URLSearchParams();

		if (category && category !== 'all') params.append('category', category);
		if (status && status !== 'all') params.append('status', status);
		if (priceOrder) params.append('priceOrder', priceOrder);
		if (limit) params.append('limit', limit);

		// Build pagination links
		const baseParams = params.toString();
		const prevLink = result.hasPrevPage
			? `/products?${baseParams}&page=${result.prevPage}`
			: null;
		const nextLink = result.hasNextPage
			? `/products?${baseParams}&page=${result.nextPage}`
			: null;
		const firstLink = result.page > 1 ? `/products?${baseParams}&page=1` : null;
		const lastLink =
			result.page < result.totalPages
				? `/products?${baseParams}&page=${result.totalPages}`
				: null;

		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({
			error: false,
			message: `Products fetched successfully`,
			payload: {
				products: result.docs,
				totalPages: result.totalPages,
				prevPage: result.prevPage,
				nextPage: result.nextPage,
				page: result.page,
				hasPrevPage: result.hasPrevPage,
				hasNextPage: result.hasNextPage,
				prevLink,
				nextLink,
				firstLink,
				lastLink,
			},
		});
	} catch (error) {
		console.error('Error fetching products:', error.message);
		errorHandler(error, res);
	}
});

//* GET a product by id *****************************************/
router.get('/:id', async (req, res) => {
	try {
		const { id } = req.params;

		// verify that the ID has valid format
		if (!isValidObjectId(id)) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(400).json({
				error: true,
				message: 'Invalid product ID format',
				payload: null,
			});
		}
		const product = await ProductsManager.getBy({ _id: id });

		if (!product) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(404).json({
				error: true,
				message: 'Product not found - The product with the specified ID does not exist',
				payload: null,
			});
		}

		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({
			error: false,
			message: `Product fetched successfully`,
			payload: { product },
		});
	} catch (error) {
		console.error('Error fetching the product:', error.message);
		errorHandler(error, res);
	}
});

//* CREATE a new product *****************************************/
router.post('/', uploader.single('file'), async (req, res) => {
	try {
		const { title, description, code, price, stock, category } = req.body;

		const thumbnail = req.file
			? '/img/' + req.file.filename
			: 'https://prd.place/400?id=14';

		// Verify if there is already a product with the same title
		const existingProduct = await ProductsManager.getBy({ title });

		if (existingProduct) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(409).json({
				error: true,
				message: `A product with the title "${title}" already exists`,
				payload: null,
			});
		}

		const product = {
			title,
			description,
			code,
			price,
			stock,
			category,
			thumbnail,
		};

		// Save the product
		const newProduct = await ProductsManager.create(product);

		res.setHeader('Content-Type', 'application/json');
		return res.status(201).json({
			error: false,
			message: `Product created successfully`,
			payload: { product: newProduct },
		});
	} catch (error) {
		console.error('Error creating the product:', error.message);
		errorHandler(error, res);
	}
});

//* UPDATE a product by id *****************************************/
router.put('/:id', uploader.single('file'), async (req, res) => {
	try {
		const { title, description, code, price, stock, category } = req.body;
		const { id } = req.params;

		// Use new thumbnail if recived, or keep the previous if not
		const thumbnail = req.file ? '/img/' + req.file.filename : req.body.thumbnail;

		// Verify if there is another product with the same title
		const existingProduct = await ProductsManager.getBy({ title });

		if (existingProduct && existingProduct._id.toString() !== id) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(400).json({
				error: true,
				message: `Other product with the title "${title}" already exists.`,
				payload: null,
			});
		}

		//try to update the product
		const updatedProduct = await ProductsManager.update(req.params.id, {
			title,
			description,
			code,
			price,
			stock,
			category,
			thumbnail,
		});

		if (!updatedProduct) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(404).json({
				error: true,
				message: 'Product not found - The product with the specified ID does not exist',
				payload: null,
			});
		}

		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({
			error: false,
			message: 'Product updated successfully',
			payload: { updatedProduct },
		});
	} catch (error) {
		console.error('Error deleting the product:', error.message);
		errorHandler(error, res);
	}
});

//* DELETE ***************************************************/
router.delete('/:id', async (req, res) => {
	try {
		const { id } = req.params;

		// verify that the ID has valid format
		if (!isValidObjectId(id)) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(400).json({
				error: true,
				message: 'Invalid product ID format',
				payload: null,
			});
		}

		// Delete the product
		const deletedProduct = await ProductsManager.delete(id);

		if (!deletedProduct) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(404).json({
				error: true,
				message: 'Product not found - No product exists with the specified ID',
				payload: null,
			});
		}

		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({
			error: false,
			message: 'Product deleted successfully',
			payload: { product: deletedProduct },
		});
	} catch (error) {
		console.error('Error deleting the product:', error.message);
		errorHandler(error, res);
	}
});

import { ProductsDAO } from '../dao/ProductsDAO.js';
import { categoriesList, errorHandler, isValidObjectId } from '../utils.js';

export class ProductsController {
	//* GET all product  **********************************************/
	static async getProducts(req, res) {
		try {
			const {
				category = 'all',
				status = 'all',
				priceOrder,
				page = 1,
				limit = 10,
			} = req.query;

			// validate category
			if (category && category !== 'all' && !categoriesList.includes(category)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid category provided',
					payload: null,
				});
			}

			// Validate status (just accept 'all', 'active' or 'inactive')
			const validStatus = ['all', 'in-stock', 'low-stock', 'out-of-stock'];
			if (status && !validStatus.includes(status)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid status provided',
					payload: null,
				});
			}

			// Validate Priceorder (just accept 'asc' or 'desc')
			const validPriceOrder = ['asc', 'desc'];
			if (priceOrder && !validPriceOrder.includes(priceOrder)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid priceOrder provided',
					payload: null,
				});
			}

			// validate page and limit must be positive integers
			const pageNumber = parseInt(page, 10) || 1;
			const limitNumber = parseInt(limit, 10) || 10;

			// build the filter object
			const filter = {};
			if (category !== 'all') filter.category = category;
			if (status !== 'all') filter.availabilityStatus = status;

			const options = {
				page: pageNumber,
				limit: limitNumber,
				sort: {},
				lean: true,
			};

			if (priceOrder) {
				options.sort.price = priceOrder === 'asc' ? 1 : -1;
			}

			// query the database
			const result = await ProductsDAO.get(filter, options);

			// If there are no products, return an empty array
			if (!result || result.length === 0) {
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

			//return the response
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
			console.error('❌ Error fetching products:', error.message);
			errorHandler(error, res);
		}
	}

	//* GET a product by id *****************************************/
	static async getProduct(req, res) {
		try {
			const { id } = req.params;

			// verify that the ID has valid format
			if (!isValidObjectId(id)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid product ID format',
					payload: null,
				});
			}
			const product = await ProductsDAO.getBy({ _id: id });

			if (!product) {
				return res.status(404).json({
					error: true,
					message: 'Product not found - The product with the specified ID does not exist',
					payload: null,
				});
			}

			return res.status(200).json({
				error: false,
				message: `Product fetched successfully`,
				payload: { product },
			});
		} catch (error) {
			console.error('❌ Error fetching the product:', error.message);
			errorHandler(error, res);
		}
	}

	//* CREATE a new product *****************************************/
	static async createProduct(req, res) {
		try {
			const { title, description, code, price, stock, category } = req.body;

			// Validate required fields
			if (!title || !description || !code || !price || stock === undefined || !category) {
				return res.status(400).json({
					error: true,
					message: 'Missing required fields',
					payload: null,
				});
			}

			// Validate price and stock
			const parsedPrice = parseFloat(price);
			const parsedStock = parseInt(stock, 10);

			if (isNaN(parsedPrice) || parsedPrice <= 0) {
				return res.status(400).json({
					error: true,
					message: 'Price must be a positive decimal number',
					payload: null,
				});
			}

			if (isNaN(parsedStock) || parsedStock < 0) {
				return res.status(400).json({
					error: true,
					message: 'Stock must be a non-negative integer',
					payload: null,
				});
			}

			// Set availabilityStatus based on stock
			let availabilityStatus = '';
			if (parsedStock === 0) {
				availabilityStatus = 'out-of-stock'; // Stock is 0
			} else if (parsedStock < 5) {
				availabilityStatus = 'low-stock'; // Stock is between 1 and 4
			} else {
				availabilityStatus = 'in-stock'; // Stock is 5 or more
			}

			// Validate category
			if (!categoriesList.includes(category)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid category',
					payload: null,
				});
			}

			// asign default thumbnail if not provided (dicactic goal)
			const thumbnail = req.file
				? '/img/' + req.file.filename
				: 'https://prd.place/400?id=14';

			// Check for duplicate title
			const existingProduct = await ProductsDAO.getBy({ title });

			if (existingProduct) {
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
				availabilityStatus,
			};

			// Save the product
			const newProduct = await ProductsDAO.create(product);

			return res.status(201).json({
				error: false,
				message: `Product created successfully`,
				payload: { product: newProduct },
			});
		} catch (error) {
			console.error('❌ Error creating the product:', error.message);
			errorHandler(error, res);
		}
	}

	//* UPDATE a product by id *****************************************/
	static async updateProduct(req, res) {
		try {
			const { title, description, code, price, stock, category } = req.body;
			const { id } = req.params;

			// verify that the ID has valid format
			if (!isValidObjectId(id)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid product ID format',
					payload: null,
				});
			}

			// Initialize product fields to update
			const updatedFields = {};

			// Check and update each field only if it's provided in the request body
			if (title) {
				updatedFields.title = title;
			}

			if (description) {
				updatedFields.description = description;
			}

			if (code) {
				updatedFields.code = code;
			}

			// Validate and update price if provided
			if (price !== undefined) {
				const parsedPrice = parseFloat(price);
				if (isNaN(parsedPrice) || parsedPrice <= 0) {
					return res.status(400).json({
						error: true,
						message: 'Price must be a positive decimal number',
						payload: null,
					});
				}
				updatedFields.price = parsedPrice;
			}

			// Validate and update stock if provided
			if (stock !== undefined) {
				const parsedStock = parseInt(stock, 10);
				if (isNaN(parsedStock) || parsedStock < 0) {
					return res.status(400).json({
						error: true,
						message: 'Stock must be a non-negative integer',
						payload: null,
					});
				}

				// Set availability status based on stock
				let availabilityStatus = '';
				if (parsedStock === 0) {
					availabilityStatus = 'out-of-stock';
				} else if (parsedStock < 5) {
					availabilityStatus = 'low-stock';
				} else {
					availabilityStatus = 'in-stock';
				}
				updatedFields.stock = parsedStock;
				updatedFields.availabilityStatus = availabilityStatus;
			}

			// Validate and update category if provided
			if (category) {
				if (!categoriesList.includes(category)) {
					return res.status(400).json({
						error: true,
						message: 'Invalid category',
						payload: null,
					});
				}
				updatedFields.category = category;
			}

			// Use new thumbnail if received, or keep the previous one if not
			if (req.file) {
				updatedFields.thumbnail = '/img/' + req.file.filename;
			} else if (req.body.thumbnail) {
				updatedFields.thumbnail = req.body.thumbnail;
			}

			// Try to update the product in the database
			const updatedProduct = await ProductsDAO.update(id, updatedFields);

			if (!updatedProduct) {
				return res.status(400).json({
					error: true,
					message:
						'Failed to update product - The product may not exist or there was an issue with the request',
					payload: null,
				});
			}

			return res.status(200).json({
				error: false,
				message: 'Product updated successfully',
				payload: { updatedProduct },
			});
		} catch (error) {
			console.error('❌ Error deleting the product:', error.message);
			errorHandler(error, res);
		}
	}

	//* DELETE ***************************************************/
	static async deleteProduct(req, res) {
		try {
			const { id } = req.params;

			// verify that the ID has valid format
			if (!isValidObjectId(id)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid product ID format',
					payload: null,
				});
			}

			// Delete the product
			const deletedProduct = await ProductsDAO.delete(id);

			if (!deletedProduct) {
				return res.status(404).json({
					error: true,
					message: 'Product not found - No product exists with the specified ID',
					payload: null,
				});
			}

			return res.status(200).json({
				error: false,
				message: 'Product deleted successfully',
				payload: { product: deletedProduct },
			});
		} catch (error) {
			console.error('❌ Error deleting the product:', error.message);
			errorHandler(error, res);
		}
	}
}

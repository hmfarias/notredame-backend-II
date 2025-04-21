import { Router } from 'express';
import { CartsManagerMongo as CartsManager } from '../dao/CartsManagerMongo.js';
import { ProductsManagerMongo as ProductsManager } from '../dao/ProductsManagerMongo.js';
import { errorHandler, isValidObjectId, roundToTwoDecimals as round } from '../utils.js';

export const router = Router();

//* GET ALL CARTS **********************************************/
router.get('/', async (req, res) => {
	try {
		const carts = await CartsManager.get();
		if (!carts || carts.length === 0) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(404).json({
				message: 'No carts found',
				error: true,
				payload: null,
			});
		}

		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({
			message: 'Carts retrieved successfully',
			error: false,
			payload: { carts },
		});
	} catch (error) {
		console.error('❌ Error fetching carts:', error.message);
		errorHandler(error, res);
	}
});

//* GET A CART BY ID **********************************************/
router.get('/:cid', async (req, res) => {
	try {
		const cartId = req.params.cid;

		// verify that the ID has valid format
		if (!isValidObjectId(cartId)) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(400).json({
				error: true,
				message: 'Invalid cart ID format',
				payload: null,
			});
		}

		const cart = await CartsManager.getBy({ _id: cartId });

		if (!cart) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(404).json({
				error: true,
				message: 'Cart not found - The cart with the specified ID does not exist',
				payload: null,
			});
		}

		// TotalProduct Recalculate for each product in case the prices of a product change
		const updatedProducts = cart.products.map((item) => {
			const totalProduct = Math.round(item.quantity * item.product.price * 100) / 100;
			return { ...item, totalProduct };
		});

		// Calculate the total cart by adding all the totalproduct in case the prices of a product change // Round two decimals
		const totalCart = round(
			updatedProducts.reduce((acc, item) => acc + item.totalProduct, 0)
		);

		// Create the formatted cart with updated values
		const formattedCart = {
			...cart,
			products: updatedProducts,
			totalCart: totalCart,
		};

		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({
			error: false,
			message: `Cart fetched successfully`,
			payload: { cart: formattedCart },
		});
	} catch (error) {
		console.error('❌ Error fetching the cart:', error.message);
		errorHandler(error, res);
	}
});

//* CREATE a new empty cart ************************************/
router.post('/', async (req, res) => {
	try {
		// Create a new empty cart
		const cart = {
			products: [],
			total: 0,
		};
		// Save the cart
		const newCart = await CartsManager.create(cart);

		res.setHeader('Content-Type', 'application/json');
		return res.status(201).json({
			message: 'Cart created successfully',
			error: false,
			payload: { cart: newCart },
		});
	} catch (error) {
		console.error('❌ Error creating the cart:', error.message);
		errorHandler(error, res);
	}
});

//* POST A PRODUCT IN AN EXISTING CART ************************/
router.post('/:cid/product/:pid', async (req, res) => {
	try {
		const cartId = req.params.cid;
		const productId = req.params.pid;
		// verify that the ID has valid format
		if (!isValidObjectId(cartId)) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(400).json({
				error: true,
				message: 'Invalid cart ID format',
				payload: null,
			});
		}
		if (!isValidObjectId(productId)) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(400).json({
				error: true,
				message: 'Invalid product ID format',
				payload: null,
			});
		}

		// Find the product
		const product = await ProductsManager.getBy({ _id: productId });

		// If the product is not found, return an error
		if (!product) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(404).json({
				message: 'Product not found',
				error: true,
				payload: null,
			});
		}

		// Find the cart
		let cart = await CartsManager.getBy({ _id: cartId });

		// If the cart is not found, return an error
		if (!cart) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(404).json({
				message: 'Cart not found',
				error: true,
				payload: null,
			});
		}

		// If the cart exists, add the product to the cart
		// Find the product in the cart first
		const productInCart = cart.products.find(
			(prod) => String(prod.product._id) === String(product._id)
		);

		// If the product is already in the cart, increment the quantity
		if (productInCart) {
			productInCart.quantity += 1;
			productInCart.totalProduct = productInCart.quantity * product.price;
		} else {
			// If the product is not in the cart, add it
			cart.products.push({
				product: product._id,
				quantity: 1,
				totalProduct: product.price,
			});
		}
		cart.totalCart = round(
			cart.products.reduce((acc, curr) => acc + curr.totalProduct, 0)
		);

		const updatedCart = await CartsManager.update(cart);

		res.setHeader('Content-Type', 'application/json');
		return res.status(201).json({
			message: 'Product successfully added to cart ',
			error: false,
			payload: { cart: updatedCart },
		});
	} catch (error) {
		console.error('❌ Error fetching products:', error.message);
		errorHandler(error, res);
	}
});

//* DELETE A PRODUCT IN AN EXISTING CART ************************/
router.delete('/:cid/product/:pid', async (req, res) => {
	try {
		const cartId = req.params.cid;
		const productId = req.params.pid;

		// verify that the ID has valid format
		if (!isValidObjectId(cartId)) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(400).json({
				error: true,
				message: 'Invalid cart ID format',
				payload: null,
			});
		}
		if (!isValidObjectId(productId)) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(400).json({
				error: true,
				message: 'Invalid product ID format',
				payload: null,
			});
		}

		// Find the cart
		const cart = await CartsManager.getBy({ _id: cartId });

		// If the cart is not found, return an error
		if (!cart) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(404).json({
				message: 'Cart not found',
				error: true,
				payload: null,
			});
		}

		// Find the product
		const product = await ProductsManager.getBy({ _id: productId });

		// If the product is not found, return an error
		if (!product) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(404).json({
				message: 'Product not found',
				error: true,
				payload: null,
			});
		}

		// Find the product in the cart
		const productInCart = cart.products.find(
			(prod) => String(prod.product._id) === String(product._id)
		);

		// If the product is not in the cart, return an error
		if (!productInCart) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(404).json({
				message: 'Product not found in cart',
				error: true,
				payload: null,
			});
		}

		// Reduce the quantity or remove the product in the cart
		if (productInCart.quantity === 1) {
			cart.products = cart.products.filter(
				(prod) => String(prod.product._id) !== String(product._id)
			);
		} else {
			productInCart.quantity -= 1;
			productInCart.totalProduct = productInCart.quantity * product.price;
		}

		// Update the total cart
		cart.totalCart = round(
			cart.products.reduce((acc, curr) => acc + curr.totalProduct, 0)
		);

		// If there are still products, update the cart
		const updatedCart = await CartsManager.update(cart);

		res.setHeader('Content-Type', 'application/json');
		return res.status(201).json({
			message: 'product successfully subtracted from cart ',
			error: false,
			payload: { cart: updatedCart },
		});
	} catch (error) {
		console.error('❌ Error deleting the product from the cart:', error.message);
		errorHandler(error, res);
	}
});

//* DELETE THE COMPLETE PRODUCT IN AN EXISTING CART ************************/
router.delete('/:cid/product/:pid/delete', async (req, res) => {
	try {
		const cartId = req.params.cid;
		const productId = req.params.pid;

		// verify that the ID has valid format
		if (!isValidObjectId(cartId)) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(400).json({
				error: true,
				message: 'Invalid cart ID format',
				payload: null,
			});
		}
		if (!isValidObjectId(productId)) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(400).json({
				error: true,
				message: 'Invalid product ID format',
				payload: null,
			});
		}

		// Find the cart
		const cart = await CartsManager.getBy({ _id: cartId });

		// If the cart is not found, return an error
		if (!cart) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(404).json({
				message: 'Cart not found',
				error: true,
				payload: null,
			});
		}

		// Find the product
		const product = await ProductsManager.getBy({ _id: productId });

		// If the product is not found, return an error
		if (!product) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(404).json({
				message: 'Product not found',
				error: true,
				payload: null,
			});
		}

		// Find the product in the cart
		const productInCart = cart.products.find(
			(prod) => String(prod.product._id) === String(product._id)
		);

		// If the product is not in the cart, return an error
		if (!productInCart) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(404).json({
				message: 'Product not found in cart',
				error: true,
				payload: null,
			});
		}

		// Delete the product from the cart
		cart.products = cart.products.filter(
			(prod) => String(prod.product._id) !== String(product._id)
		);

		// Update the total cart
		cart.totalCart = round(
			cart.products.reduce((acc, curr) => acc + curr.totalProduct, 0)
		);

		// If there are still products, update the cart
		const updatedCart = await CartsManager.update(cart);

		res.setHeader('Content-Type', 'application/json');
		return res.status(201).json({
			message: 'product successfully deleted from cart ',
			error: false,
			payload: { cart: updatedCart },
		});
	} catch (error) {
		console.error('❌ Error deleting the product from the cart:', error.message);
		errorHandler(error, res);
	}
});

//* DELETE A COMPLETE CART ************************/
router.delete('/:cid', async (req, res) => {
	try {
		const cartId = req.params.cid;

		// verify that the ID has valid format
		if (!isValidObjectId(cartId)) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(400).json({
				error: true,
				message: 'Invalid cart ID format',
				payload: null,
			});
		}

		// Delete the cart
		const deletedCart = await CartsManager.delete(cartId);

		if (!deletedCart) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(404).json({
				error: true,
				message: 'Cart not found - No cart exists with the specified ID',
				payload: null,
			});
		}

		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({
			error: false,
			message: 'Cart successfully deleted',
			payload: { cart: deletedCart },
		});
	} catch (error) {
		console.error('❌ Error deleting the cart:', error.message);
		errorHandler(error, res);
	}
});

//* EMPTY A CART ************************/
router.delete('/empty/:cid', async (req, res) => {
	try {
		const cartId = req.params.cid;

		// verify that the ID has valid format
		if (!isValidObjectId(cartId)) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(400).json({
				error: true,
				message: 'Invalid cart ID format',
				payload: null,
			});
		}

		// empty the cart
		const emptyCart = await CartsManager.empty(cartId);

		if (!emptyCart) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(404).json({
				error: true,
				message: 'Cart not found - No cart exists with the specified ID',
				payload: null,
			});
		}

		res.setHeader('Content-Type', 'application/json');
		return res.status(200).json({
			error: false,
			message: 'Cart successfully emptied',
			payload: { cart: emptyCart },
		});
	} catch (error) {
		console.error('❌ Error emptying the cart:', error.message);
		errorHandler(error, res);
	}
});

//* MERGE TWO CARTS ************************/
// This endpoint merges two carts by combining their products and quantities
// and then deletes the source cart.
// It assumes that the source cart's products will be merged into the target cart.
router.post('/merge', async (req, res) => {
	try {
		const { sourceCartId, targetCartId } = req.body;

		// Validate both IDs
		if (!isValidObjectId(sourceCartId) || !isValidObjectId(targetCartId)) {
			return res.status(400).json({
				error: true,
				message: 'Invalid cart ID(s)',
				payload: null,
			});
		}

		// Fetch both carts
		const sourceCart = await CartsManager.getBy({ _id: sourceCartId });
		const targetCart = await CartsManager.getBy({ _id: targetCartId });

		if (!sourceCart || !targetCart) {
			return res.status(404).json({
				error: true,
				message: 'One or both carts not found',
				payload: null,
			});
		}

		// Merge logic: combine quantities and products
		sourceCart.products.forEach((sourceItem) => {
			const existingItem = targetCart.products.find(
				(targetItem) => String(targetItem.product._id) === String(sourceItem.product._id)
			);

			if (existingItem) {
				existingItem.quantity += sourceItem.quantity;
				existingItem.totalProduct = existingItem.quantity * sourceItem.product.price;
			} else {
				targetCart.products.push(sourceItem);
			}
		});

		// Recalculate totalCart
		targetCart.totalCart = round(
			targetCart.products.reduce((acc, item) => acc + item.totalProduct, 0)
		);

		// Save the updated target cart
		const updatedCart = await CartsManager.update(targetCart);

		// Delete the source cart
		await CartsManager.delete(sourceCartId);

		return res.status(200).json({
			error: false,
			message: 'Carts merged successfully',
			payload: { cart: updatedCart },
		});
	} catch (error) {
		console.error('Error deleting the cart:', error.message);
		errorHandler(error, res);
	}
});

import { CartsDAO as CartsDAO } from '../dao/CartsDAO.js';
import { CartsService } from '../services/carts.service.js';
import { ProductsDAO } from '../dao/ProductsDAO.js';
import { errorHandler, isValidObjectId, roundToTwoDecimals } from '../utils.js';

export class CartsController {
	//* GET ALL CARTS **********************************************/
	static async getCarts(req, res) {
		try {
			// const carts = await CartsDAO.get();
			const carts = await CartsService.getCarts();
			if (!carts || carts.length === 0) {
				return res.status(404).json({
					message: 'No carts found',
					error: true,
					payload: null,
				});
			}

			return res.status(200).json({
				message: 'Carts retrieved successfully',
				error: false,
				payload: { carts },
			});
		} catch (error) {
			console.error('❌ Error fetching carts:', error.message);
			errorHandler(error, res);
		}
	}

	//* GET A CART BY ID **********************************************/
	static async getCart(req, res) {
		try {
			const cartId = req.params.cid;

			// verify that the ID has valid format
			if (!isValidObjectId(cartId)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid cart ID format',
					payload: null,
				});
			}

			// const cart = await CartsDAO.getBy({ _id: cartId });
			const cart = await CartsService.getCartById({ _id: cartId });

			if (!cart) {
				return res.status(404).json({
					error: true,
					message: 'Cart not found - The cart with the specified ID does not exist',
					payload: null,
				});
			}

			// TotalProduct Recalculate for each product in case the prices of a product change
			const updatedProducts = cart.products.map((item) => {
				const totalProduct = roundToTwoDecimals(item.quantity * item.product.price);
				return { ...item, totalProduct };
			});

			// Calculate the total cart by adding all the totalproduct in case the prices of a product change // Round two decimals
			const totalCart = roundToTwoDecimals(
				updatedProducts.reduce((acc, item) => acc + item.totalProduct, 0)
			);

			// Create the formatted cart with updated values
			const formattedCart = {
				...cart,
				products: updatedProducts,
				totalCart: totalCart,
			};

			return res.status(200).json({
				error: false,
				message: `Cart fetched successfully`,
				payload: { cart: formattedCart },
			});
		} catch (error) {
			console.error('❌ Error fetching the cart:', error.message);
			errorHandler(error, res);
		}
	}

	//* CREATE a new empty cart ************************************/
	static async createCart(req, res) {
		try {
			// Create a new empty cart
			const cart = {
				products: [],
				total: 0,
			};
			// Save the cart
			// const newCart = await CartsDAO.create(cart);
			const newCart = await CartsService.createCart(cart);

			return res.status(201).json({
				message: 'Cart created successfully',
				error: false,
				payload: { cart: newCart },
			});
		} catch (error) {
			console.error('❌ Error creating the cart:', error.message);
			errorHandler(error, res);
		}
	}

	//* POST A PRODUCT IN AN EXISTING CART *************************/
	static async addProductToCart(req, res) {
		try {
			const cartId = req.params.cid;
			const productId = req.params.pid;
			// verify that the ID has valid format
			if (!isValidObjectId(cartId)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid cart ID format',
					payload: null,
				});
			}
			if (!isValidObjectId(productId)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid product ID format',
					payload: null,
				});
			}

			// Find the product
			const product = await ProductsDAO.getBy({ _id: productId });

			// If the product is not found, return an error
			if (!product) {
				return res.status(404).json({
					message: 'Product not found',
					error: true,
					payload: null,
				});
			}

			// Find the cart
			// let cart = await CartsDAO.getBy({ _id: cartId });
			let cart = await CartsService.getCartById({ _id: cartId });

			// If the cart is not found, return an error
			if (!cart) {
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
			cart.totalCart = roundToTwoDecimals(
				cart.products.reduce((acc, curr) => acc + curr.totalProduct, 0)
			);

			// const updatedCart = await CartsDAO.update(cart);
			const updatedCart = await CartsService.updateCart(cart);

			return res.status(201).json({
				message: 'Product successfully added to cart ',
				error: false,
				payload: { cart: updatedCart },
			});
		} catch (error) {
			console.error('❌ Error fetching products:', error.message);
			errorHandler(error, res);
		}
	}

	//* REMOVE A PRODUCT FROM A CART *******************************/
	static async removeProductFromCart(req, res) {
		try {
			const cartId = req.params.cid;
			const productId = req.params.pid;

			// verify that the ID has valid format
			if (!isValidObjectId(cartId)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid cart ID format',
					payload: null,
				});
			}
			if (!isValidObjectId(productId)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid product ID format',
					payload: null,
				});
			}

			// Find the cart
			// const cart = await CartsDAO.getBy({ _id: cartId });
			const cart = await CartsService.getCartById({ _id: cartId });

			// If the cart is not found, return an error
			if (!cart) {
				return res.status(404).json({
					message: 'Cart not found',
					error: true,
					payload: null,
				});
			}

			// Find the product
			const product = await ProductsDAO.getBy({ _id: productId });

			// If the product is not found, return an error
			if (!product) {
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
			cart.totalCart = roundToTwoDecimals(
				cart.products.reduce((acc, curr) => acc + curr.totalProduct, 0)
			);

			// If there are still products, update the cart
			// const updatedCart = await CartsDAO.update(cart);
			const updatedCart = await CartsService.updateCart(cart);

			return res.status(201).json({
				message: 'product successfully subtracted from cart ',
				error: false,
				payload: { cart: updatedCart },
			});
		} catch (error) {
			console.error('❌ Error deleting the product from the cart:', error.message);
			errorHandler(error, res);
		}
	}

	//* DELETE THE ENTIRE PRODUCT FROM AN EXISTING CART ************************/
	static async deleteProductFromCart(req, res) {
		try {
			const cartId = req.params.cid;
			const productId = req.params.pid;

			// verify that the ID has valid format
			if (!isValidObjectId(cartId)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid cart ID format',
					payload: null,
				});
			}
			if (!isValidObjectId(productId)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid product ID format',
					payload: null,
				});
			}

			// Find the cart
			// const cart = await CartsDAO.getBy({ _id: cartId });
			const cart = await CartsService.getCartById({ _id: cartId });

			// If the cart is not found, return an error
			if (!cart) {
				return res.status(404).json({
					message: 'Cart not found',
					error: true,
					payload: null,
				});
			}

			// Find the product
			const product = await ProductsDAO.getBy({ _id: productId });

			// If the product is not found, return an error
			if (!product) {
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
			cart.totalCart = roundToTwoDecimals(
				cart.products.reduce((acc, curr) => acc + curr.totalProduct, 0)
			);

			// If there are still products, update the cart
			// const updatedCart = await CartsDAO.update(cart);
			const updatedCart = await CartsService.updateCart(cart);

			return res.status(201).json({
				message: 'product successfully deleted from cart ',
				error: false,
				payload: { cart: updatedCart },
			});
		} catch (error) {
			console.error('❌ Error deleting the product from the cart:', error.message);
			errorHandler(error, res);
		}
	}

	//* DELETE A COMPLETE CART ************************/
	static async deleteCart(req, res) {
		try {
			const cartId = req.params.cid;

			// verify that the ID has valid format
			if (!isValidObjectId(cartId)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid cart ID format',
					payload: null,
				});
			}

			// Delete the cart
			// const deletedCart = await CartsDAO.delete(cartId);
			const deletedCart = await CartsService.deleteCart(cartId);

			if (!deletedCart) {
				return res.status(404).json({
					error: true,
					message: 'Cart not found - No cart exists with the specified ID',
					payload: null,
				});
			}

			return res.status(200).json({
				error: false,
				message: 'Cart successfully deleted',
				payload: { cart: deletedCart },
			});
		} catch (error) {
			console.error('❌ Error deleting the cart:', error.message);
			errorHandler(error, res);
		}
	}

	//* EMPTY A CART ************************/
	static async emptyCart(req, res) {
		try {
			const cartId = req.params.cid;

			// verify that the ID has valid format
			if (!isValidObjectId(cartId)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid cart ID format',
					payload: null,
				});
			}

			// Build an empty cart object
			const emptyCart = {
				_id: cartId,
				products: [],
				totalCart: 0,
			};

			// update the cart to empty it
			// const emptiedCart = await CartsDAO.update(emptyCart);
			const emptiedCart = await CartsService.updateCart(emptyCart);

			if (!emptiedCart) {
				return res.status(404).json({
					error: true,
					message: 'Cart not found - No cart exists with the specified ID',
					payload: null,
				});
			}

			return res.status(200).json({
				error: false,
				message: 'Cart successfully emptied',
				payload: { cart: emptyCart },
			});
		} catch (error) {
			console.error('❌ Error emptying the cart:', error.message);
			errorHandler(error, res);
		}
	}

	//* MERGE TWO CARTS ************************/
	// This endpoint merges two carts by combining their products and quantities
	// and then deletes the source cart.
	// It assumes that the source cart's products will be merged into the target cart.
	static async mergeCarts(req, res) {
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
			// const sourceCart = await CartsDAO.getBy({ _id: sourceCartId });
			// const targetCart = await CartsDAO.getBy({ _id: targetCartId });
			const sourceCart = await CartsService.getCartById({ _id: sourceCartId });
			const targetCart = await CartsService.getCartById({ _id: targetCartId });

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
					(targetItem) =>
						String(targetItem.product._id) === String(sourceItem.product._id)
				);

				if (existingItem) {
					existingItem.quantity += sourceItem.quantity;
					existingItem.totalProduct = existingItem.quantity * sourceItem.product.price;
				} else {
					targetCart.products.push(sourceItem);
				}
			});

			// Recalculate totalCart
			targetCart.totalCart = roundToTwoDecimals(
				targetCart.products.reduce((acc, item) => acc + item.totalProduct, 0)
			);

			// Save the updated target cart
			// const updatedCart = await CartsDAO.update(targetCart);
			const updatedCart = await CartsService.updateCart(targetCart);

			// Delete the source cart
			await CartsDAO.delete(sourceCartId);

			return res.status(200).json({
				error: false,
				message: 'Carts merged successfully',
				payload: { cart: updatedCart },
			});
		} catch (error) {
			console.error('Error deleting the cart:', error.message);
			errorHandler(error, res);
		}
	}
}

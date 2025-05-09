import { cartsService } from '../services/carts.service.js';
import { productsService } from '../services/products.service.js';
import { ticketsService } from '../services/tickets.service.js';
import { errorHandler, isValidObjectId, roundToTwoDecimals } from '../utils.js';

export class CartsController {
	//* GET ALL CARTS **********************************************/
	static async getCarts(req, res) {
		try {
			const carts = await cartsService.getCarts();
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

			const cart = await cartsService.getCartByFilter({ _id: cartId });

			if (!cart) {
				return res.status(404).json({
					error: true,
					message: 'Cart not found - The cart with the specified ID does not exist',
					payload: null,
				});
			}

			return res.status(200).json({
				error: false,
				message: `Cart fetched successfully`,
				payload: { cart },
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
			const newCart = await cartsService.createCart(cart);

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
			const product = await productsService.getProductByFilter({ _id: productId });

			// If the product is not found, return an error
			if (!product) {
				return res.status(404).json({
					message: 'Product not found',
					error: true,
					payload: null,
				});
			}

			// Find the cart
			let cart = await cartsService.getCartByFilter({ _id: cartId });

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

			const updatedCart = await cartsService.updateCart(cart);

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

			const cart = await cartsService.getCartByFilter({ _id: cartId });

			// If the cart is not found, return an error
			if (!cart) {
				return res.status(404).json({
					message: 'Cart not found',
					error: true,
					payload: null,
				});
			}

			// Find the product
			const product = await productsService.getProductByFilter({ _id: productId });

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
			const updatedCart = await cartsService.updateCart(cart);

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

	//* ADD MULTIPLE PRODUCTS TO CART - SENDIND [{product, quantity}] BY BODY **********/
	static async addProductsToCart(req, res) {
		try {
			const cartId = req.params.cid;
			const { products: productsToAdd } = req.body; // [{ productId, quantity }, ...]

			// Validate cart ID
			if (!isValidObjectId(cartId)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid cart ID format',
					payload: null,
				});
			}

			// Validate body structure
			if (!Array.isArray(productsToAdd) || productsToAdd.length === 0) {
				return res.status(400).json({
					error: true,
					message: 'Invalid or empty product list',
					payload: null,
				});
			}

			// Get the cart
			const cart = await cartsService.getCartByFilter({ _id: cartId });
			if (!cart) {
				return res.status(404).json({
					error: true,
					message: 'Cart not found',
					payload: null,
				});
			}

			const notAdded = [];

			for (const item of productsToAdd) {
				const { product: productId, quantity } = item;

				// Validate productId and quantity
				if (!isValidObjectId(productId)) {
					notAdded.push({
						productId,
						quantity,
						reason: 'Invalid product ID',
					});
					continue;
				}
				// Validate quantity
				const parsedQuantity = parseInt(quantity, 10);

				if (
					typeof quantity === 'undefined' ||
					quantity === null ||
					isNaN(parsedQuantity) ||
					parsedQuantity < 0
				) {
					notAdded.push({
						productId,
						quantity,
						reason: 'Quantity must be a valid non-negative number',
					});
					continue;
				}

				// Fetch product
				const product = await productsService.getProductByFilter({ _id: productId });
				if (!product) {
					notAdded.push({
						productId,
						quantity,
						reason: 'Product not found',
					});
					continue;
				}

				// Check if product already in cart
				const existingProduct = cart.products.find(
					(p) => String(p.product._id) === String(productId)
				);

				// If quantity is 0 and product exists, remove it
				if (parsedQuantity === 0 && existingProduct) {
					cart.products = cart.products.filter(
						(p) => String(p.product._id) !== String(productId)
					);
					continue;
				}

				// If product exists, increase quantity
				if (existingProduct) {
					existingProduct.quantity += parsedQuantity;
					existingProduct.totalProduct = roundToTwoDecimals(
						existingProduct.quantity * product.price
					);
				} else if (parsedQuantity > 0) {
					// Add product to cart
					cart.products.push({
						product: product._id,
						quantity: parsedQuantity,
						totalProduct: roundToTwoDecimals(parsedQuantity * product.price),
					});
				}
			}

			// Recalculate totalCart
			cart.totalCart = roundToTwoDecimals(
				cart.products.reduce((acc, item) => acc + item.totalProduct, 0)
			);

			const updatedCart = await cartsService.updateCart(cart);

			// Return partial success if some products failed
			if (notAdded.length > 0) {
				return res.status(207).json({
					error: true,
					message: 'Some products could not be added to the cart',
					payload: {
						cart: updatedCart,
						notAdded,
					},
				});
			}

			return res.status(200).json({
				error: false,
				message: 'All products successfully added to cart',
				payload: {
					cart: updatedCart,
				},
			});
		} catch (error) {
			console.error('❌ Error adding multiple products to cart:', error.message);
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
			const cart = await cartsService.getCartByFilter({ _id: cartId });

			// If the cart is not found, return an error
			if (!cart) {
				return res.status(404).json({
					message: 'Cart not found',
					error: true,
					payload: null,
				});
			}

			// Find the product
			const product = await productsService.getProductByFilter({ _id: productId });

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
			const updatedCart = await cartsService.updateCart(cart);

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
			const deletedCart = await cartsService.deleteCart(cartId);

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
			const emptiedCart = await cartsService.updateCart(emptyCart);

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
			const sourceCart = await cartsService.getCartByFilter({ _id: sourceCartId });
			const targetCart = await cartsService.getCartByFilter({ _id: targetCartId });

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
			const updatedCart = await cartsService.updateCart(targetCart);

			// Delete the source cart
			await cartsService.deleteCart(sourceCartId);

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

	//* PURCHASE A CART *********************************************/
	static async purchaseCart(req, res) {
		try {
			const cartId = req.params.cid;
			const user = req.user;

			// Validate cart ID
			if (!isValidObjectId(cartId)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid cart ID format',
					payload: null,
				});
			}

			// Fetch the cart
			const cart = await cartsService.getCartByFilter({ _id: cartId });

			if (!cart) {
				return res.status(404).json({
					error: true,
					message: 'Cart not found',
					payload: null,
				});
			}

			if (cart.products.length === 0) {
				return res.status(404).json({
					error: true,
					message: 'Cart is empty',
					payload: null,
				});
			}

			let totalAmount = 0;
			const productsPurchased = [];
			const productsNotPurchased = [];

			for (const item of cart.products) {
				const product = await productsService.getProductByFilter({
					_id: item.product._id,
				});

				if (!product || product.stock < item.quantity) {
					productsNotPurchased.push(item);
					continue;
				}

				// Update product stock
				const newStock = product.stock - item.quantity;
				await productsService.updateProduct(product._id, { stock: newStock });

				const subtotal = roundToTwoDecimals(item.quantity * item.product.price);
				totalAmount += roundToTwoDecimals(subtotal);

				productsPurchased.push({
					product: item.product._id,
					quantity: item.quantity,
					subtotal,
				});
			}

			// Create ticket only if there are items purchased
			let ticket = null;
			if (productsPurchased.length > 0) {
				ticket = await ticketsService.createTicket({
					amount: roundToTwoDecimals(totalAmount),
					purchaser: user.email.toLowerCase(),
					products: productsPurchased,
				});
			}

			// Update the cart with only the products that could not be purchased
			const updatedCart = await cartsService.updateCart({
				_id: cart._id,
				products: productsNotPurchased,
				totalCart: roundToTwoDecimals(
					productsNotPurchased.reduce(
						(acc, item) => acc + item.quantity * item.product.price,
						0
					)
				),
			});

			// Response if no products were purchased
			if (productsPurchased.length === 0) {
				return res.status(422).json({
					error: true,
					message: 'No products were processed',
					payload: {
						ticket: null,
						notProcessed: productsNotPurchased.map((p) => ({
							productId: p.product._id,
							quantity: p.quantity,
							reason: 'Insufficient stock',
						})),
						cart: updatedCart,
					},
				});
			}

			// Response if products were purchased
			return res.status(200).json({
				error: productsNotPurchased.length > 0,
				message:
					productsNotPurchased.length > 0
						? 'Purchase processed but with unavailable products'
						: 'Purchase processed successfully',
				payload: {
					ticket: ticket || null,
					notProcessed: productsNotPurchased.map((p) => ({
						productId: p.product._id,
						quantity: p.quantity,
						reason: 'Insufficient stock',
					})),
					cart: updatedCart,
				},
			});
		} catch (error) {
			console.error('❌ Error processing purchase:', error.message);
			errorHandler(error, res);
		}
	}
}

import { CartModel } from './models/cart.model.js';

export class CartsManagerMongo {
	// GET all carts ---------------------------------------------------
	static async get() {
		return await CartModel.find().lean();
	}

	// CREATE a new cart  ---------------------------------------------------
	static async create(cart) {
		const newCart = await CartModel.create(cart);
		return newCart.toObject();
	}

	// GET a cart by ID or filter -------------------------------------------
	static async getBy(filter) {
		return await CartModel.findOne(filter).lean();
	}

	// UPDATE a cart's products and totalCart value ------------------------
	static async update(cart) {
		const updatedCart = await CartModel.findOneAndUpdate(
			{ _id: cart._id },
			{ $set: { products: cart.products, totalCart: cart.totalCart } }, // Update only necessary fields
			{ new: true, lean: true } // Return updated document as plain object
		);
		return updatedCart || null; // Return null if cart not found
	}

	// DELETE a cart
	static async delete(id) {
		const cart = await CartModel.findByIdAndDelete(id);
		return cart ? cart.toObject() : null; // Return null if not found
	}

	// Check if a cart contains a specific product (optimized for ObjectId comparisons)
	static hasProduct(cart, productId) {
		try {
			// If the cart does not exist, return false
			if (!cart) return false;

			// Ensure productId is a valid ObjectId before comparing
			return cart.products.some(
				(item) => item.product._id?.toString() === productId.toString()
			);
		} catch (error) {
			console.error('Error checking product in cart:', error.message);
			return false;
		}
	}
}

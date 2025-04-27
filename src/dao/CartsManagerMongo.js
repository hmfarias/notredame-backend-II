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
			{ $set: { products: cart.products, totalCart: cart.totalCart } },
			{ new: true, lean: true } // Return updated document as plain object
		);
		return updatedCart || null; // Return null if cart not found
	}

	// DELETE a cart ------------------------------------------------
	static async delete(id) {
		const cart = await CartModel.findByIdAndDelete(id);
		return cart ? cart.toObject() : null; // Return null if not found
	}
}

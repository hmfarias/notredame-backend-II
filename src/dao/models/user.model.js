import mongoose from 'mongoose';
import './cart.model.js';

const { Schema } = mongoose;

const collection = 'users';

const userSchema = new Schema(
	{
		first_name: { type: String, required: true },
		last_name: { type: String, required: true },
		email: { type: String, unique: true, required: true },
		age: { type: Number, required: true },
		password: { type: String, required: true },
		cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts', default: null },
		role: { type: String, default: 'user' },
	},
	{
		timestamps: true,
		strict: true,
	}
);

// Populate cart field automatically when finding users
userSchema.pre(['find', 'findOne'], function (next) {
	this.populate('cart', '_id totalCart');
	next();
});

// Middleware to delete the associated cart when the user is deleted
userSchema.pre(
	['deleteOne', 'findByIdAndDelete'],
	{ document: true, query: false },
	async function (next) {
		try {
			// Check if the user has a cart
			if (this.cart) {
				// If a cart exists, delete it
				await mongoose.model('carts').deleteOne({ _id: this.cart });
			}
			next(); // Proceed with the deletion of the user
		} catch (error) {
			console.error('❌ Error deleting the associated cart:', error.message);
			next(error);
		}
	}
);

export const userModel = mongoose.model(collection, userSchema);

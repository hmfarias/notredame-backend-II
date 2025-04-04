import mongoose from 'mongoose';

const { Schema } = mongoose;

const collection = 'users';

const userSchema = new Schema({
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	email: { type: String, unique: true, required: true },
	age: { type: Number, required: true },
	password: { type: String, required: true },
	cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' },
	role: { type: String, default: 'user' },
});

// Populate cart field automatically when finding users
userSchema.pre(['find', 'findOne'], function (next) {
	this.populate('cart', '_id totalCart');
	next();
});

export const userModel = mongoose.model(collection, userSchema);

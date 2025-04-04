import mongoose from 'mongoose';

export const cartModel = mongoose.model(
	'carts',
	new mongoose.Schema({
		products: {
			type: [
				{
					product: {
						type: mongoose.Schema.Types.ObjectId,
						ref: 'products',
					},
					quantity: { type: Number, required: true, default: 1 },
					totalProduct: { type: Number, required: true, default: 0 },
				},
			],
			default: [],
		},
		totalCart: { type: Number, default: 0 },
	})
);

// Populate the products
cartSchema.pre(['find', 'findOne'], function (next) {
	this.populate('products.product', '_id title price thumbnail');
	next();
});

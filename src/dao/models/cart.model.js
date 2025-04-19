import mongoose from 'mongoose';

const { Schema } = mongoose;

const collection = 'carts';

const cartSchema = new Schema(
	{
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
	},
	{
		timestamps: true,
		strict: true,
	}
);

cartSchema.pre(['find', 'findOne', 'findById', 'findOneAndUpdate'], function (next) {
	this.populate('products.product', '_id title price thumbnail');
	next();
});

export const CartModel = mongoose.model(collection, cartSchema);

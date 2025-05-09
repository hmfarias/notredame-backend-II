import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { CartModel } from './cart.model.js';

const { Schema } = mongoose;

const collection = 'products';

export const categoryList = [
	'beauty',
	'fragrances',
	'furniture',
	'groceries',
	'home-decoration',
	'kitchen-accessories',
	'laptops',
	'mens-shirts',
	'mens-shoes',
	'mens-watches',
	'mobile-accessories',
	'motorcycle',
	'skin-care',
	'smartphones',
	'sports-accessories',
	'sunglasses',
	'tablets',
	'tops',
	'vehicle',
	'womens-bags',
	'womens-dresses',
	'womens-jewellery',
	'womens-shoes',
	'womens-watches',
	'Herramientas',
];

const productSchema = new Schema(
	{
		title: { type: String, required: true, unique: true },
		description: { type: String, required: true },
		category: {
			type: String,
			enum: categoryList, // Only accept values ​​on this list
			required: true,
		},
		price: { type: Number, required: true },
		rating: { type: Number, default: 4.5 },
		stock: { type: Number, required: true },
		code: { type: String, required: false, default: 'RCH45Q1A' },
		availabilityStatus: { type: String, default: 'in-stock' },
		thumbnail: { type: String, required: false },
	},
	{
		timestamps: true,
		strict: true,
	}
);

productSchema.plugin(mongoosePaginate);

/**
 * Middleware that runs before deleting a product.
 * It is responsible for eliminating this product from all the carts in which it is present.
 */
productSchema.pre('findOneAndDelete', async function (next) {
	try {
		const productId = this.getQuery()._id; // Obtener el _id del producto que se está eliminando

		// Remove the product from all the carts where it is present
		await CartModel.updateMany(
			{ 'products.product': productId }, // Search for active carts containing this product
			{ $pull: { products: { product: productId } } } // Delete the product from the list
		);

		next();
	} catch (error) {
		next(error);
	}
});

export const ProductModel = mongoose.model(collection, productSchema);

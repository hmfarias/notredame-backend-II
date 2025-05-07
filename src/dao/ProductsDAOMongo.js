import { ProductModel } from './models/product.model.js';

export class ProductsDAOMongo {
	//* GET all products with pagination ----------------------
	static async get(filter = {}, options = {}) {
		const result = await ProductModel.paginate(filter, options);
		return result;
	}

	//* GET a product by ID or filter -----------------------
	static async getBy(filter) {
		return await ProductModel.findOne(filter).lean();
	}

	//* CREATE a new product -------------------------------
	static async create(product) {
		const newProduct = await ProductModel.create(product);
		return newProduct.toJSON();
	}

	//* UPDATE a product by ID -----------------------------
	static async update(id, product) {
		const updatedProduct = await ProductModel.findOneAndUpdate(
			{ _id: id }, // Search for _id
			{ $set: product }, // Update with new product data
			{ new: true, lean: true } // Returns the updated document as a flat object
		);
		return updatedProduct || null; // Return the updated or null product if you are not
	}

	//* DELETE a product by ID -----------------------------
	static async delete(id) {
		const product = await ProductModel.findByIdAndDelete(id);
		return product ? product.toObject() : null; // avoid error if product is null
	}
}

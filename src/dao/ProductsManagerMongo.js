import { ProductModel } from './models/product.model.js';

export class ProductsManagerMongo {
	// GET products with filters and pagination -------------------------------
	static async get({ category, status, priceOrder, page = 1, limit = 10 }) {
		const filter = {};

		// Add filter by category
		if (category && category !== 'all') {
			filter.category = category;
		}

		// Add filter by availability status
		if (status && status !== 'all') {
			filter.availabilityStatus = status;
		}

		// Pagination options configuration
		const options = {
			page: parseInt(page, 10),
			limit: parseInt(limit, 10),
			sort: {},
			lean: true, // To improve performance
		};

		// Apply price order if provided
		if (priceOrder === 'asc' || priceOrder === 'desc') {
			options.sort.price = priceOrder === 'asc' ? 1 : -1;
		}

		// Execute and returnthe query with pagination
		const result = await ProductModel.paginate(filter, options);

		// If there are no products, return an empty array
		if (result.docs.length === 0) {
			return { products: [], totalDocs: 0, totalPages: 0, currentPage: 1 };
		}

		return result;
	}

	// CREATE a new product -------------------------------
	static async create(product) {
		const newProduct = await ProductModel.create(product);
		return newProduct.toJSON();
	}

	// GET a product by ID or filter -----------------------
	static async getBy(filter) {
		return await ProductModel.findOne(filter).lean();
	}

	// UPDATE a product by ID -----------------------------
	static async update(id, product) {
		const updatedProduct = await ProductModel.findOneAndUpdate(
			{ _id: id }, // Search for _id
			{ $set: product }, // Update with new product data
			{ new: true, lean: true } // Returns the updated document as a flat object
		);
		return updatedProduct || null; // Return the updated or null product if you are not
	}

	// DELETE a product by ID -----------------------------
	static async delete(id) {
		const product = await ProductModel.findByIdAndDelete(id);
		return product ? product.toObject() : null; // avoid error if product is null
	}
}

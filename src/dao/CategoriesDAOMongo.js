import { CategoryModel } from './models/categoy.model.js';

CategoryModel;

export class CategoriesDAOMongo {
	//* GET all categories ---------------------------------------------------
	static async get() {
		return await CategoryModel.find().lean();
	}

	//* CREATE a new category  ---------------------------------------------------
	static async create(cart) {
		const newCategory = await CategoryModel.create(cart);
		return newCategory.toObject();
	}

	//* GET a category by ID or filter -------------------------------------------
	static async getBy(filter) {
		return await CategoryModel.findOne(filter).lean();
	}

	//* UPDATE a categoty ------------------------
	static async update(category) {
		const updatedCategory = await CategoryModel.findOneAndUpdate(
			{ _id: category._id },
			{ $set: { name: category.name, slug: category.slug, url: category.url } },
			{ new: true, lean: true } // Return updated document as plain object
		);
		return updatedCategory || null; // Return null if category not found
	}

	//* DELETE a category ------------------------------------------------
	static async delete(id) {
		const category = await CategoryModel.findByIdAndDelete(id);
		return category ? category.toObject() : null; // Return null if not found
	}
}

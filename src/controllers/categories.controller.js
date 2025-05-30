import { categoriesService } from '../services/categories.service.js';
import { errorHandler, isValidObjectId } from '../utils.js';

export class CategoriesController {
	//* GET ALL CATEGORIES **********************************************/
	static async getCategories(req, res) {
		try {
			const categories = await categoriesService.getCategories();
			if (!categories || categories.length === 0) {
				return res.status(404).json({
					message: 'No categories found',
					error: true,
					payload: null,
				});
			}

			return res.status(200).json({
				message: 'Categories retrieved successfully',
				error: false,
				payload: { categories },
			});
		} catch (error) {
			console.error('❌ Error fetching categories:', error.message);
			errorHandler(error, res);
		}
	}

	//* GET A CATEGORY BY ID **********************************************/
	static async getCategory(req, res) {
		try {
			const categoryId = req.params.id;

			// verify that the ID has valid format
			if (!isValidObjectId(categoryId)) {
				return res.status(400).json({
					error: true,
					message: `Invalid category ID format ${categoryId}`,
					payload: null,
				});
			}

			const category = await categoriesService.getCategoryByFilter({ _id: categoryId });

			if (!category) {
				return res.status(404).json({
					error: true,
					message:
						'Category not found - The category with the specified ID does not exist',
					payload: null,
				});
			}

			return res.status(200).json({
				error: false,
				message: `Category fetched successfully`,
				payload: { category },
			});
		} catch (error) {
			console.error('❌ Error fetching the category:', error.message);
			errorHandler(error, res);
		}
	}

	//* CREATE a new category ************************************/
	static async createCategory(req, res) {
		try {
			const { slug, name, url } = req.body;

			// Validate required fields
			if (!slug || !name || !url) {
				return res.status(400).json({
					error: true,
					message: 'Missing required fields',
					payload: null,
				});
			}

			// Check for duplicate name or slug
			let existingCategory = false;
			existingCategory = await categoriesService.getCategoryByFilter({ slug });
			existingCategory = await categoriesService.getCategoryByFilter({ name });

			if (existingCategory) {
				return res.status(409).json({
					error: true,
					message: `A category with the name "${name}" or slug "${slug}" already exists`,
					payload: null,
				});
			}

			const category = {
				slug,
				name,
				url,
			};

			// Save the category
			const newCategory = await categoriesService.createCategory(category);

			return res.status(201).json({
				error: false,
				message: `Category created successfully`,
				payload: { category: newCategory },
			});
		} catch (error) {
			console.error('❌ Error creating the category:', error);
			errorHandler(error, res);
		}
	}

	//* UPDATE A CATEGORY by ID **********************************************/
	static async updateCategory(req, res) {
		try {
			const { slug, name, url } = req.body;
			const { id } = req.params;

			// verify that the ID has valid format
			if (!isValidObjectId(id)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid category ID format',
					payload: null,
				});
			}

			// Initialize category fields to update
			const updatedFields = {};

			// Check and update each field only if it's provided in the request body
			if (slug) {
				updatedFields.slug = slug;
			}

			if (name) {
				updatedFields.name = name;
			}

			if (url) {
				updatedFields.url = url;
			}

			// Try to update the category in the database
			const updatedCategory = await categoriesService.updateCategory(id, updatedFields);

			if (!updatedCategory) {
				return res.status(400).json({
					error: true,
					message:
						'Failed to update category - The category may not exist or there was an issue with the request',
					payload: null,
				});
			}

			return res.status(200).json({
				error: false,
				message: 'Category updated successfully',
				payload: { updatedCategory },
			});
		} catch (error) {
			console.error('❌ Error updating the category:', error.message);
			errorHandler(error, res);
		}
	}

	//* DELETE ***************************************************/
	static async deleteCategory(req, res) {
		try {
			const { id } = req.params;

			// verify that the ID has valid format
			if (!isValidObjectId(id)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid category ID format',
					payload: null,
				});
			}

			// Delete the category
			const deletedCategory = await categoriesService.deleteCategory(id);

			if (!deletedCategory) {
				return res.status(404).json({
					error: true,
					message: 'Category not found - No category exists with the specified ID',
					payload: null,
				});
			}

			return res.status(200).json({
				error: false,
				message: 'Category successfully deleted',
				payload: { category: deletedCategory },
			});
		} catch (error) {
			console.error('❌ Error deleting the category:', error.message);
			errorHandler(error, res);
		}
	}
}

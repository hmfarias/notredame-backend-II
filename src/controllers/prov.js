//* UPDATE a product by id *****************************************/
static async updateProduct(req, res) {
	try {
		const { title, description, code, price, stock, category } = req.body;
		const { id } = req.params;

		// Verify that the ID has a valid format
		if (!isValidObjectId(id)) {
			return res.status(400).json({
				error: true,
				message: 'Invalid product ID format',
				payload: null,
			});
		}

		// Initialize product fields to update
		const updatedFields = {};

		// Check and update each field only if it's provided in the request body
		if (title) {
			updatedFields.title = title;
		}

		if (description) {
			updatedFields.description = description;
		}

		if (code) {
			updatedFields.code = code;
		}

		// Validate and update price if provided
		if (price !== undefined) {
			const parsedPrice = parseFloat(price);
			if (isNaN(parsedPrice) || parsedPrice <= 0) {
				return res.status(400).json({
					error: true,
					message: 'Price must be a positive decimal number',
					payload: null,
				});
			}
			updatedFields.price = parsedPrice;
		}

		// Validate and update stock if provided
		if (stock !== undefined) {
			const parsedStock = parseInt(stock, 10);
			if (isNaN(parsedStock) || parsedStock < 0) {
				return res.status(400).json({
					error: true,
					message: 'Stock must be a non-negative integer',
					payload: null,
				});
			}

			// Set availability status based on stock
			let availabilityStatus = '';
			if (parsedStock === 0) {
				availabilityStatus = 'out-of-stock';
			} else if (parsedStock < 5) {
				availabilityStatus = 'low-stock';
			} else {
				availabilityStatus = 'in-stock';
			}
			updatedFields.stock = parsedStock;
			updatedFields.availabilityStatus = availabilityStatus;
		}

		// Validate and update category if provided
		if (category) {
			if (!categoriesList.includes(category)) {
				return res.status(400).json({
					error: true,
					message: 'Invalid category',
					payload: null,
				});
			}
			updatedFields.category = category;
		}

		// Use new thumbnail if received, or keep the previous one if not
		if (req.file) {
			updatedFields.thumbnail = '/img/' + req.file.filename;
		} else if (req.body.thumbnail) {
			updatedFields.thumbnail = req.body.thumbnail;
		}

		// Try to update the product in the database
		const updatedProduct = await ProductsManager.update(id, updatedFields);

		if (!updatedProduct) {
			return res.status(400).json({
				error: true,
				message: 'Failed to update product - The product may not exist or there was an issue with the request',
				payload: null,
			});
		}

		// Send success response
		return res.status(200).json({
			error: false,
			message: 'Product updated successfully',
			payload: { updatedProduct },
		});
	} catch (error) {
		console.error('❌ Error updating the product:', error.message);
		errorHandler(error, res);
	}
}
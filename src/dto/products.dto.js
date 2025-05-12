export class ProductsDTO {
	//* Format product output: only include selected fields
	static formatProductOutput(data) {
		const formatProduct = ({
			_id,
			title,
			description,
			price,
			stock,
			status,
			availabilityStatus,
			category,
			thumbnail,
		}) => ({
			_id,
			title,
			description,
			price,
			stock,
			status,
			availabilityStatus,
			category: category?.toUpperCase(),
			thumbnail,
		});

		// If an object paginated with "docs" comes, it processes it and returns the same modified object
		if (typeof data === 'object' && data.docs && Array.isArray(data.docs)) {
			return {
				...data,
				docs: data.docs.map(formatProduct),
			};
		}

		// Si viene un array simple
		if (Array.isArray(data)) {
			return data.map(formatProduct);
		}

		// Si viene un solo producto
		return formatProduct(data);
	}
}

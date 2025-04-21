// Get product ID from URL
const getProductIdFromURL = () => {
	const segments = window.location.pathname.split('/');
	return segments[segments.length - 1];
};

// List of categories
const categoryList = [
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
];

// Populate category select
const populateCategorySelect = (currentCategory) => {
	const select = document.getElementById('category');
	select.innerHTML = '';
	categoryList.forEach((cat) => {
		const option = document.createElement('option');
		option.value = cat;
		option.textContent = cat;
		if (cat === currentCategory) option.selected = true;
		select.appendChild(option);
	});
};

// Render product in the form
const renderForm = (product) => {
	document.getElementById('page-title').textContent = `Edit ${product.title}`;
	document.getElementById('title').value = product.title;
	document.getElementById('description').value = product.description;
	document.getElementById('code').value = product.code;
	document.getElementById('price').value = product.price;
	document.getElementById('stock').value = product.stock;
	document.getElementById('thumbnail').value = product.thumbnail;
	document.getElementById('preview').src = product.thumbnail;

	populateCategorySelect(product.category);
};

// Handle form submit
const setupFormSubmit = (productId) => {
	const form = document.getElementById('update-form');
	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		const formData = new FormData(form);

		try {
			const response = await fetch(`/api/products/${productId}`, {
				method: 'PUT',
				body: formData,
			});
			const data = await response.json();

			if (data.error) {
				throw new Error(data.message);
			}

			await Swal.fire({
				title: 'Success!',
				text: 'Product updated successfully.',
				icon: 'success',
				timer: 2000,
				position: 'top-end',
				showConfirmButton: false,
				toast: true,
			});

			window.location.href = `/product?id=${productId}`;
		} catch (error) {
			console.error('❌ Error updating product:', error.message);
			Swal.fire({
				title: 'Error',
				text: error.message,
				icon: 'error',
				timer: 3000,
				position: 'top-end',
				showConfirmButton: false,
				toast: true,
			});
		}
	});
};

// Main
document.addEventListener('DOMContentLoaded', async () => {
	const productId = getProductIdFromURL();

	try {
		const response = await fetch(`/api/products/${productId}`);
		const { payload } = await response.json();

		if (!payload?.product) {
			throw new Error('Product not found');
		}

		renderForm(payload.product);
		setupFormSubmit(productId);
	} catch (err) {
		console.error('Error loading product:', err.message);
		document.querySelector('.form-insert').innerHTML = `
			<p style="color:red; font-size:1.2rem;">Error: ${err.message}</p>
		`;
	}
});

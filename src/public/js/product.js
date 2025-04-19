// Extract product ID from URL
const getProductIdFromURL = () => {
	const params = new URLSearchParams(window.location.search);
	return params.get('id');
};

// Get cart ID from localStorage
const getCartIdFromStorage = () => localStorage.getItem('cartId');

// Create a cart if needed and add the product to it
const createCartAndAddProduct = async (productId) => {
	let cartId = getCartIdFromStorage();

	if (!cartId) {
		try {
			const response = await fetch('/carts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			});
			const data = await response.json();
			if (data.error) throw new Error(data.message);

			cartId = data.payload.id;
			localStorage.setItem('cartId', cartId);

			await Swal.fire({
				title: 'Cart created',
				text: 'A new cart was created successfully.',
				icon: 'success',
				position: 'top-end',
				timer: 1500,
				showConfirmButton: false,
				toast: true,
			});
		} catch (error) {
			console.error('Error creating cart:', error.message);
			return;
		}
	}

	await addProductToCart(cartId, productId);
};

// Add product to existing cart
const addProductToCart = async (cartId, productId) => {
	try {
		const response = await fetch(`/carts/${cartId}/product/${productId}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		});
		const data = await response.json();
		if (data.error) throw new Error(data.message);

		Swal.fire({
			title: 'Added!',
			text: 'Product added to cart.',
			icon: 'success',
			position: 'top-end',
			timer: 1500,
			showConfirmButton: false,
			toast: true,
		});
	} catch (error) {
		console.error('Error adding product to cart:', error.message);
	}
};

// Remove or decrease product quantity from cart
const removeProductFromCart = async (cartId, productId) => {
	try {
		const response = await fetch(`/carts/${cartId}/product/${productId}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
		});
		const data = await response.json();
		if (data.error) throw new Error(data.message);

		Swal.fire({
			title: 'Updated!',
			text: 'Product subtracted from cart.',
			icon: 'info',
			position: 'top-end',
			timer: 1500,
			showConfirmButton: false,
			toast: true,
		});
	} catch (error) {
		console.error('Error removing product from cart:', error.message);
	}
};

// Render product in the DOM
const renderProduct = (product) => {
	const container = document.querySelector('.product-container');
	if (!container) return;

	container.innerHTML = `
		<img src='${product.thumbnail}' alt='${product.title}' />

		<div>
			<h2>${product.title}</h2>
			<p>ID: ${product._id}</p>
			<p>${product.description}</p>
			<p>Price: $${product.price}</p>
			<p>Stock: ${product.stock}</p>
			<p>Status: ${product.availabilityStatus}</p>
			<p>Category: ${product.category}</p>
		</div>

		<div class='container-buttons j-between'>
			<div>
				<p>Add to cart</p>
				<div class='container'>
					<button id='subs-to-cart-btn' data-product-id='${product._id}'><i class='fa-solid fa-minus'></i></button>
					<button id='add-to-cart-btn' data-product-id='${product._id}'><i class='fa-solid fa-plus'></i></button>
				</div>
			</div>
			<button onclick="window.location.href = '/products'">Products List</button>
			<div>
				<p>Edit</p>
				<button type='button' class='button-update' data-product-id='${product._id}'><i class='fa-solid fa-pen-to-square'></i></button>
			</div>
			<div>
				<p>Delete</p>
				<button type='button' class='button-delete' id='delete-product-btn' data-product-id='${product._id}'>
					<i class='fa-regular fa-trash-can'></i>
				</button>
			</div>
		</div>
	`;
};

// Get current user from session
const getCurrentUser = async () => {
	try {
		const response = await fetch('/api/sessions/current');
		if (!response.ok) return null;
		const data = await response.json();
		return data.payload.user || null;
	} catch (err) {
		console.error('Error getting current user:', err);
		return null;
	}
};

// DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
	const productId = getProductIdFromURL();

	try {
		const response = await fetch(`/api/products/${productId}`);
		const data = await response.json();

		if (data.error || !data.payload?.product) {
			throw new Error(data.message || 'Product not found');
		}

		const product = data.payload.product;

		renderProduct(product);

		// Restrict edit/delete to admin only
		const user = await getCurrentUser();
		console.log('✅ ~ document.addEventListener ~ user:', user);

		const editBtn = document.querySelector('.button-update');
		const deleteBtn = document.querySelector('.button-delete');

		if (!user || user.role !== 'admin') {
			if (editBtn) {
				editBtn.disabled = true;
				editBtn.style.opacity = '0.5';
				editBtn.title = 'Admin access required';
			}
			if (deleteBtn) {
				deleteBtn.disabled = true;
				deleteBtn.style.opacity = '0.5';
				deleteBtn.title = 'Admin access required';
			}
		}

		// Add to cart
		document.getElementById('add-to-cart-btn')?.addEventListener('click', () => {
			createCartAndAddProduct(product._id);
		});

		// Remove from cart
		document.getElementById('subs-to-cart-btn')?.addEventListener('click', () => {
			const cartId = getCartIdFromStorage();
			if (!cartId) {
				Swal.fire({
					title: 'Warning!',
					text: 'No cart found in localStorage.',
					icon: 'warning',
					position: 'top-end',
					timer: 1500,
					showConfirmButton: false,
					toast: true,
				});
				return;
			}
			removeProductFromCart(cartId, product._id);
		});

		// Edit button
		document.querySelector('.button-update')?.addEventListener('click', () => {
			window.location.href = `/products/updateProduct/${product._id}`;
		});
	} catch (error) {
		console.error('Error loading product:', error.message);
		document.querySelector('.product-container').innerHTML = `
			<p style="color:red; font-size:1.2rem;">Error: ${error.message}</p>
		`;
	}
});

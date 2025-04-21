// Extract cart ID from URL
const getCartIdFromURL = () => {
	const parts = window.location.pathname.split('/');
	return parts[parts.length - 1];
};
const cartId = getCartIdFromURL();

// Fetch and render the cart
const fetchAndRenderCart = async () => {
	try {
		const response = await fetch(`/api/carts/${cartId}`);
		const data = await response.json();

		if (data.error) {
			throw new Error(data.message);
		}

		renderCart(data.payload.cart);
		attachEventListeners();
	} catch (error) {
		console.error('❌ Error fetching cart:', error.message);
		document.getElementById('cart-container').innerHTML = `
			<p style="color:red; font-size:1.2rem;">Error: ${error.message}</p>
		`;
	}
};

// Render the cart into the DOM
const renderCart = (cart) => {
	const container = document.getElementById('cart-container');

	if (!cart.products.length) {
		container.innerHTML = '<p>No products in the cart.</p>';
		return;
	}

	let html = ``;

	cart.products.forEach((item) => {
		html += `
			<div class='cart-item'>
				<img src='${item.product.thumbnail}' alt='${item.product.title}' />
				<div class='cart-item-details'>
					<h3 class='cart-item-title'>${item.product.title}</h3>
					<div class='quantity-buttons'>
						<button class='btn-decrease' data-product-id='${item.product._id}'><i class='fa-solid fa-minus'></i></button>
						<span>${item.quantity}</span>
						<button class='btn-increase' data-product-id='${item.product._id}'><i class='fa-solid fa-plus'></i></button>
					</div>
				</div>
				<div class='cart-item-price'>
					<p class='price-label'>Precio Unitario</p>
					$${item.product.price}
				</div>
				<div class='cart-item-quantity'>
					<p class='quantity-label'>Cantidad</p>
					${item.quantity}
				</div>
				<div class='cart-item-total'>
					<p class='total-label'>Total</p>
					$${item.totalProduct}
				</div>
				<button class='button-delete' data-product-id='${item.product._id}'><i class='fa-regular fa-trash-can'></i></button>
			</div>
		`;
	});

	html += `
		<div class='cart-total'>Total Cart: $${cart.totalCart}</div>
		<div class='container-buttons j-end'>
			<p>Empty Cart</p>
			<button id="button-empty-cart" class='button-empty-cart' data-cart-id='${cart.id}'>
				<i class='fa-regular fa-trash-can'></i>
			</button>
		</div>
	`;

	container.innerHTML = html;
};

// Function to increase the amount of a product in the cart
const increaseProductQuantity = async (cartId, productId) => {
	try {
		const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		});
		await response.json();
		await fetchAndRenderCart();
	} catch (error) {
		console.error('❌ Error increasing quantity:', error.message);
	}
};

// Function to reduce the amount of a product in the cart
const decreaseProductQuantity = async (cartId, productId) => {
	try {
		const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
		});
		await response.json();
		await fetchAndRenderCart();
	} catch (error) {
		console.error('❌ Error decreasing quantity:', error.message);
	}
};

// Function to delete an entire product from the cart
const deleteEntireProduct = async (cartId, productId) => {
	try {
		await fetch(`/api/carts/${cartId}/product/${productId}/delete`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
		});
		await fetchAndRenderCart();
	} catch (error) {
		console.error('❌ Error deleting product:', error.message);
	}
};

// Function to empty a cart
const emptyCart = async (cartId) => {
	try {
		await fetch(`/api/carts/empty/${cartId}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
		});
		window.location.reload();
	} catch (error) {
		console.error('❌ Error deleting cart:', error.message);
	}
};

// Attach listeners after rendering
const attachEventListeners = () => {
	document.querySelectorAll('.btn-increase').forEach((btn) => {
		btn.addEventListener('click', () => {
			const productId = btn.dataset.productId;

			increaseProductQuantity(cartId, productId);
		});
	});
	document.querySelectorAll('.btn-decrease').forEach((btn) => {
		btn.addEventListener('click', () => {
			const productId = btn.dataset.productId;
			decreaseProductQuantity(cartId, productId);
		});
	});
	document.querySelectorAll('.button-delete').forEach((btn) => {
		btn.addEventListener('click', () => {
			const productId = btn.dataset.productId;
			deleteEntireProduct(cartId, productId);
		});
	});
	const emptyCartBtn = document.getElementById('button-empty-cart');
	if (emptyCartBtn) {
		emptyCartBtn.addEventListener('click', () => {
			emptyCart(cartId);
		});
	}
};

// Load everything
document.addEventListener('DOMContentLoaded', fetchAndRenderCart);

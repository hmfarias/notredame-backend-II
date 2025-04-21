// Clear localStorage before starting a new session
localStorage.removeItem('currentUser');

const params = new URLSearchParams(window.location.search);
const email = params.get('email');

const inputEmail = document.getElementById('email');
email ? (inputEmail.value = email) : null;
const inputPassword = document.getElementById('password');

const btnLogin = document.getElementById('btnLogin');

btnLogin.addEventListener('click', async (e) => {
	e.preventDefault();
	const user = {
		email: inputEmail.value,
		password: inputPassword.value,
	};

	if (!user.email || !user.password) {
		Swal.fire({
			text: 'All fields are required',
			icon: 'error',
			position: 'top-end',
			timer: 2000,
			showConfirmButton: false,
			toast: true,
		});
		return;
	}
	try {
		const response = await fetch('/api/sessions/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user),
			redirect: 'manual',
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({})); // Prevent error if response body is not JSON
			const errorMessage =
				errorData.message || response.statusText || 'Unknown error during the process';

			Swal.fire({
				text: `${errorMessage}`,
				icon: 'error',
				position: 'top-end',
				timer: 2000,
				showConfirmButton: false,
				toast: true,
			});
			return;
		}

		const data = await response.json();

		localStorage.setItem('currentUser', JSON.stringify(data.payload.user));

		// Ask for merge carts if needed
		const localCartId = localStorage.getItem('cartId');
		const userCartId = data.payload.user.cart?._id;

		if (localCartId && userCartId && localCartId !== userCartId) {
			const result = await Swal.fire({
				title: 'Cart Merge',
				text: 'You have a saved local cart. Do you want to merge it with your user cart?',
				icon: 'question',
				showCancelButton: true,
				confirmButtonText: 'Yes, merge it',
				cancelButtonText: 'No, use my user cart',
			});

			if (result.isConfirmed) {
				// user chose to merge carts
				// Call backend to merge carts
				await fetch(`/api/carts/merge`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						sourceCartId: localCartId, // The local cart ID
						targetCartId: userCartId, // The authenticated user's cart ID
					}),
				});
				// Remove the cart ID from localStorage
				localStorage.removeItem('cartId');
			} else {
				// User chose to discard the local cart
				try {
					// Delete the cart from database using the local cart ID
					const response = await fetch(`/api/carts/${localCartId}`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
						},
					});

					const result = await response.json();

					if (!response.ok || result.error) {
						throw new Error(result.message || 'Failed to delete local cart');
					}

					// Remove the cart ID from localStorage
					localStorage.removeItem('cartId');

					console.log('🗑️ Local cart deleted successfully');
				} catch (error) {
					console.error('❌ Error deleting local cart:', error.message);
					Swal.fire({
						text: `Error deleting local cart: ${error.message}`,
						icon: 'error',
						position: 'top-end',
						timer: 3000,
						showConfirmButton: false,
						toast: true,
					});
				}
			}
		}
		// End merge carts ------

		Swal.fire({
			text: `Welcome ${data.payload.user.first_name} ${data.payload.user.last_name}!`,
			icon: 'success',
			position: 'top-end',
			timer: 1500,
			showConfirmButton: false,
			toast: true,
		}).then(() => {
			// redirect after registration
			window.location.href = '/products';
		});
	} catch (error) {
		console.error('❌ Unexpected error during registration:', error);

		Swal.fire({
			text: 'Unexpected error during registration. Please try again later.',
			icon: 'error',
			position: 'top-end',
			timer: 2000,
			showConfirmButton: false,
			toast: true,
		});
	}
});

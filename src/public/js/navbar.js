document.addEventListener('DOMContentLoaded', async () => {
	//* Enable and disable links based on user session -------------------------------------------
	const profileLink = document.getElementById('profileLink');
	const loginLink = document.getElementById('loginLink');
	const logoutLink = document.getElementById('logoutLink');
	const registerLink = document.getElementById('registerLink');

	try {
		const response = await fetch('/api/sessions/current', {
			method: 'GET',
		});

		if (!response.ok) {
			// If user is not authenticated, hide the profile link
			if (profileLink) {
				profileLink.style.pointerEvents = 'none';
				profileLink.style.opacity = '0.5';
				profileLink.title = 'Log in to access your profile';
			}
			if (logoutLink) {
				logoutLink.style.pointerEvents = 'none';
				logoutLink.style.opacity = '0.5';
				logoutLink.title = 'You are not logged in';
			}
		} else {
			if (loginLink) {
				loginLink.style.pointerEvents = 'none';
				loginLink.style.opacity = '0.5';
				loginLink.title = 'Already logged in';
			}
			if (registerLink) {
				registerLink.style.pointerEvents = 'none';
				registerLink.style.opacity = '0.5';
				registerLink.title = 'Already logged in';
			}
		}
	} catch (error) {
		console.error('❌ Error checking user session:', error);
		if (profileLink) {
			profileLink.style.pointerEvents = 'none';
			profileLink.style.opacity = '0.5';
			profileLink.title = 'Log in to access your profile';
		}
		if (logoutLink) {
			logoutLink.style.pointerEvents = 'none';
			logoutLink.style.opacity = '0.5';
			logoutLink.title = 'You are not logged in';
		}
	}
	//* end Enable and disable links based on user session ----------------------------------------

	//* Cart link ---------------------------------------------------------------------------------
	const cartLink = document.getElementById('cart-link');

	cartLink?.addEventListener('click', async (event) => {
		event.preventDefault();

		// Try to get the user from localStorage
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));

		// If there is a user and a cart associated, use it
		if (currentUser?.cart?._id) {
			return (window.location.href = `/carts/${currentUser.cart._id}`);
		}

		// Otherwise, fallback to localStorage cart
		const cartId = localStorage.getItem('cartId');

		if (cartId) {
			return (window.location.href = `/carts/${cartId}`);
		}

		// If no cart found, show warning
		await Swal.fire({
			title: 'Warning!',
			text: 'No cart found. Please add products to create it.',
			icon: 'warning',
			position: 'top-end',
			timer: 2500,
			showConfirmButton: false,
			toast: true,
		});
	});
	//* end Cart link --------------------------------------------------------------------------------

	//* Logout link ---------------------------------------------------------------------------------
	logoutLink.addEventListener('click', async (e) => {
		e.preventDefault();
		try {
			const response = await fetch('/api/sessions/logout', {
				method: 'POST',
			});

			if (!response.ok) throw new Error('Logout failed');

			await Swal.fire({
				text: 'You have been logged out',
				icon: 'success',
				position: 'top-end',
				timer: 1500,
				showConfirmButton: false,
				toast: true,
			});
			window.location.href = '/login'; // redirect to login
		} catch (error) {
			Swal.fire({
				text: 'Logout failed. Please try again.',
				icon: 'error',
				position: 'top-end',
				timer: 1500,
				showConfirmButton: false,
				toast: true,
			});
		}
	});
	//* end Logout link --------------------------------------------------------------------------------
});

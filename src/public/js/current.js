const inputName = document.getElementById('name');
const inputSurname = document.getElementById('surname');
const inputAge = document.getElementById('age');
const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');
const inputRole = document.getElementById('role');
const mainContent = document.getElementById('main-content');

try {
	const response = await fetch('/api/sessions/current', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const data = await response.json();

	// Check if the token is expired (or user unauthorized)
	if (response.status === 401 && data.message === 'jwt expired') {
		// Clean up and redirect
		localStorage.removeItem('currentUser');

		await Swal.fire({
			title: 'Session expired',
			text: 'Please log in again.',
			icon: 'warning',
			position: 'top-end',
			timer: 4000,
			showConfirmButton: false,
			toast: true,
		});

		window.location.href = '/login';
		return;
	}

	if (!response.ok || !data.payload?.user) {
		const errorMessage =
			data.message || response.statusText || 'Unknown error during session check';

		if (mainContent) {
			mainContent.style.pointerEvents = 'none';
			mainContent.style.opacity = '0.5';
		}

		await Swal.fire({
			text: `You must be logged in to access this page - ${errorMessage}`,
			icon: 'error',
			position: 'top-end',
			timer: 5000,
			showConfirmButton: false,
			toast: true,
		});

		window.location.href = '/login';
	}

	const user = data.payload.user;

	if (user) {
		if (user.first_name) inputName.value = user.first_name;
		if (user.last_name) inputSurname.value = user.last_name;
		if (user.age) inputAge.value = user.age;
		if (user.email) inputEmail.value = user.email;
		if (user.role) inputRole.value = user.role.toUpperCase();
	}
} catch (error) {
	console.error('❌ Unexpected error during session validation:', error);

	if (mainContent) {
		mainContent.style.pointerEvents = 'none';
		mainContent.style.opacity = '0.5';
	}

	Swal.fire({
		text: 'Unexpected error during session validation. Please try again later.',
		icon: 'error',
		position: 'top-end',
		timer: 3000,
		showConfirmButton: false,
		toast: true,
	});
}

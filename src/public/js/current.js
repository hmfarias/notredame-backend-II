const inputName = document.getElementById('name');
const inputSurname = document.getElementById('surname');
const inputAge = document.getElementById('age');
const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');
const mainContent = document.getElementById('main-content');

try {
	const response = await fetch('/api/sessions/current', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const data = await response.json(); // ✅ solo una vez

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

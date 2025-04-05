const inputName = document.getElementById('name');
const inputSurname = document.getElementById('surname');
const inputAge = document.getElementById('age');
const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');

try {
	const response = await fetch('/api/sessions/current', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({})); // Prevent error if response body is not JSON
		const errorMessage =
			errorData.message || response.statusText || 'Unknown error during registration';

		await Swal.fire({
			text: `You must be logged to access this page - ${errorMessage}`,
			icon: 'error',
			position: 'top-end',
			timer: 5000,
			showConfirmButton: false,
			toast: true,
		});
		window.location.href = `/login`;
	}

	const { payload } = await response.json();
	if (payload) {
		if (payload.first_name) inputName.value = payload.first_name;
		if (payload.last_name) inputSurname.value = payload.last_name;
		if (payload.age) inputAge.value = payload.age;
		if (payload.email) inputEmail.value = payload.email;
	}
} catch (error) {
	console.error('❌ Unexpected error during registration:', error);

	Swal.fire({
		text: 'Unexpected error during registration. Please try again later.',
		icon: 'error',
		position: 'top-end',
		timer: 3000,
		showConfirmButton: false,
		toast: true,
	});
}

let params = new URLSearchParams(window.location.search);
let message = params.get('message');

if (message) {
	Swal.fire({
		text: message,
		icon: 'info',
		position: 'top-end',
		timer: 3000,
		showConfirmButton: false,
		toast: true,
	});
}

const inputName = document.getElementById('name');
const inputSurname = document.getElementById('surname');
const inputAge = document.getElementById('age');
const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');

const btnRegister = document.getElementById('btnRegister');

btnRegister.addEventListener('click', async (e) => {
	e.preventDefault();
	const user = {
		first_name: inputName.value,
		last_name: inputSurname.value,
		age: inputAge.value,
		email: inputEmail.value,
		password: inputPassword.value,
	};

	if (!user.first_name || !user.last_name || !user.age || !user.email || !user.password) {
		Swal.fire({
			text: 'All fields are required',
			icon: 'error',
			position: 'top-end',
			timer: 3000,
			showConfirmButton: false,
			toast: true,
		});
		return;
	}

	try {
		const response = await fetch('/api/sessions/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({})); // Prevent error if response body is not JSON
			const errorMessage =
				errorData.message || response.statusText || 'Unknown error during registration';

			Swal.fire({
				text: `Error in the registration process: ${errorMessage}`,
				icon: 'error',
				position: 'top-end',
				timer: 3000,
				showConfirmButton: false,
				toast: true,
			});
			return;
		}

		const data = await response.json();
		console.log('✅ ~ btnRegister.addEventListener ~ data:', data);

		Swal.fire({
			text: `User ${data.payload.first_name} ${data.payload.last_name} registered successfully!`,
			icon: 'success',
			position: 'top-end',
			timer: 3000,
			showConfirmButton: false,
			toast: true,
		}).then(() => {
			//redirect after registration
			window.location.href = `/login?email=${data.payload.email}`;
		});
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
});

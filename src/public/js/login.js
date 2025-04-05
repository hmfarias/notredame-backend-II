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
			timer: 3000,
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
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({})); // Prevent error if response body is not JSON
			const errorMessage =
				errorData.message || response.statusText || 'Unknown error during registration';

			Swal.fire({
				text: `Error in the login process: ${errorMessage}`,
				icon: 'error',
				position: 'top-end',
				timer: 3000,
				showConfirmButton: false,
				toast: true,
			});
			return;
		}

		const data = await response.json();

		//save the token in local storage
		localStorage.setItem('token', data.token);

		Swal.fire({
			text: `Welcome ${data.payload.first_name} ${data.payload.last_name}!`,
			icon: 'success',
			position: 'top-end',
			timer: 3000,
			showConfirmButton: false,
			toast: true,
		}).then(() => {
			// redirect after registration
			window.location.href = '/current';
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

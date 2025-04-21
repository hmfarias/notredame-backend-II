document.addEventListener('DOMContentLoaded', () => {
	const form = document.querySelector('.form-insert');
	const inputTitle = document.getElementById('title');
	const inputDescription = document.getElementById('description');
	const inputCode = document.getElementById('code');
	const inputPrice = document.getElementById('price');
	const inputStock = document.getElementById('stock');
	const inputCategory = document.getElementById('category');
	const inputFile = document.getElementById('file');

	form.addEventListener('submit', async (event) => {
		event.preventDefault();

		// Validate required fields
		if (
			!inputTitle.value ||
			!inputDescription.value ||
			!inputCode.value ||
			!inputPrice.value ||
			!inputStock.value ||
			!inputCategory.value
		) {
			return Swal.fire({
				title: 'Missing fields',
				text: 'Please complete all required fields.',
				icon: 'warning',
				position: 'top-end',
				timer: 2500,
				showConfirmButton: false,
				toast: true,
			});
		}

		try {
			const formData = new FormData();
			formData.append('title', inputTitle.value);
			formData.append('description', inputDescription.value);
			formData.append('code', inputCode.value);
			formData.append('price', parseFloat(inputPrice.value));
			formData.append('stock', parseInt(inputStock.value));
			formData.append('category', inputCategory.value);
			if (inputFile.files[0]) {
				formData.append('file', inputFile.files[0]);
			}

			const response = await fetch('/api/products', {
				method: 'POST',
				body: formData,
			});

			const data = await response.json();

			if (!response.ok || data.error) {
				if (data.message === 'jwt expired') {
					// Action if the token expired
					localStorage.removeItem('currentUser');

					await Swal.fire({
						title: 'Session expired',
						text: 'Please log in again.',
						icon: 'warning',
						position: 'top-end',
						timer: 3000,
						showConfirmButton: false,
						toast: true,
					});

					return (window.location.href = '/login');
				}

				throw new Error(data.message || 'Product creation failed');
			}

			Swal.fire({
				title: 'Success!',
				text: 'Product created successfully.',
				icon: 'success',
				position: 'top-end',
				timer: 2000,
				showConfirmButton: false,
				toast: true,
			}).then(() => {
				window.location.href = '/products';
			});
		} catch (error) {
			console.error('Error creating product:', error.message);
			Swal.fire({
				title: 'Error!',
				text: error.message || 'Something went wrong.',
				icon: 'error',
				position: 'top-end',
				timer: 2000,
				showConfirmButton: false,
				toast: true,
			});
		}
	});
});

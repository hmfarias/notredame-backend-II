export const checkSessionValidity = async () => {
	try {
		const response = await fetch('/api/sessions/current', { method: 'GET' });
		const data = await response.json();

		if (response.status === 401 || data.message === 'jwt expired') {
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
			window.location.href = '/login';
		}
		return data;
	} catch (error) {
		console.error('❌ Error checking session validity:', error);
	}
};

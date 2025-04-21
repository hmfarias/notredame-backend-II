document.addEventListener('DOMContentLoaded', async () => {
	try {
		const response = await fetch('/api/sessions/current');

		// If there is no active session, clean localStorage
		if (!response.ok) {
			localStorage.removeItem('currentUser');
		}
	} catch (error) {
		console.error('Error checking session on home:', error.message);
		localStorage.removeItem('currentUser');
	}
});

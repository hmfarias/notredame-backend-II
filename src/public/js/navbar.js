document.addEventListener('DOMContentLoaded', async () => {
	const profileLink = document.getElementById('profileLink');
	const loginLink = document.getElementById('loginLink');
	const logoutLink = document.getElementById('logoutLink');
	const registerLink = document.getElementById('registerLink');

	try {
		const response = await fetch('/api/sessions/current', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
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
		console.error('Error checking user session:', error);
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
});

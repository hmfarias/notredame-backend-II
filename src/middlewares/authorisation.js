export const authorisation = (allowedRoles) => {
	return (req, res, next) => {
		// Ensure roles is an array
		if (!Array.isArray(allowedRoles)) {
			return res.status(500).json({
				error: true,
				message: 'Internal Server Error - allowed roles must be an array',
				payload: null,
			});
		}

		// Check if the user is authenticated
		if (!req.user) {
			return res.status(401).json({
				error: true,
				message: 'Unauthorized',
				payload: null,
			});
		}

		// If no roles are specified, roles include 'public' or the user is admin
		if (
			allowedRoles.length === 0 ||
			allowedRoles.map((r) => r.toLowerCase()).includes('public') ||
			req.user.role === 'admin'
		) {
			return next();
		}

		//Verify if the user's role is on the allowed list
		if (!allowedRoles.includes(req.user.role)) {
			return res.status(403).json({
				error: true,
				message: 'Forbidden - You do not have permission to access this resource',
				payload: null,
			});
		}

		//If everything is ok, continue to the next middleware
		next();
	};
};

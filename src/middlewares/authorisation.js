export const authorisation = (role = '') => {
	return (req, res, next) => {
		if (!req.user) {
			res.setHeader('Content-Type', 'application/json');
			return res.status(401).json({
				error: true,
				message: 'Unauthorized',
				payload: null,
			});
		}

		if (role.toLowerCase() == 'public' || role.length == 0) {
			return next();
		}

		if (req.user.role == 'admin') {
			return next();
		}

		if (req.user.role !== role) {
			return res.status(403).json({
				error: true,
				message: 'Forbidden - You do not have permission to this',
				payload: null,
			});
		}
		next();
	};
};

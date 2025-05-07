export class UsersDTO {
	//* Remove sensitive fields like password and convert first_name and last_name to uppercase
	static formatUserOutput(data) {
		const formatUser = ({ password, first_name, last_name, email, ...rest }) => ({
			first_name: first_name?.toUpperCase(),
			last_name: last_name?.toUpperCase(),
			email: email?.toLowerCase(),
			...rest,
		});

		return Array.isArray(data) ? data.map(formatUser) : formatUser(data);
	}
}

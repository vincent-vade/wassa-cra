const login = (email: string, password: string) => {
	return fetch("/api/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});
};

export const auth = {
	login,
};

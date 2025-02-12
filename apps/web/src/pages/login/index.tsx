import { useRouter } from "next/router";
import { useState } from "react";

import { useToaster } from "~/components/Toaster";

import "./login.css";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const toaster = useToaster();
	const router = useRouter();

	const handleLogin = async (e) => {
		e.preventDefault();
		const response = await fakeAuth(email, password);

		if (response.ok) {
			toaster("Logged. You will be redirected soon...", "success");

			setTimeout(() => {
				router.push("/projects");
			}, 3000);
		} else {
			toaster("Invalid credentials", "error");
		}
	};

	return (
		<div className="login container">
			<div className="form-container">
				<h1>Login</h1>
				<form className="form" onSubmit={handleLogin}>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
						name="email"
					/>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
						name="password"
					/>
					<button type="submit">Login</button>
				</form>
			</div>
		</div>
	);
};

const fakeAuth = async (email, password) => {
	return await fetch("/api/login", {
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

export default LoginPage;

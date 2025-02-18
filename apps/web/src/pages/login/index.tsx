import { type FormEvent, useState } from "react";

import "./login.css";
import { useAuth } from "~/context/AuthContext";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const auth = useAuth();

	const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		auth?.login(email, password);
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

export default LoginPage;

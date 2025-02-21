// import "./login.css";

import { Box, Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { useAuth } from "~/context/AuthContext";

const LoginPage = () => {
	const form = useForm({
		initialValues: {
			email: "",
			password: "",
		},
		validate: {
			email: (value: string) =>
				/^\S+@\S+$/.test(value) ? null : "Invalid email",
		},
	});

	const auth = useAuth();

	return (
		<Group grow gap="lg" justify="center" h="100vh">
			<Box>
				<h1>Login</h1>
			</Box>
			<Box p="lg">
				<form
					onSubmit={form.onSubmit((values) => {
						auth?.login(values.email, values.password);
					})}
				>
					<TextInput
						label="Email"
						name="email"
						size="lg"
						key={form.key("email")}
						withAsterisk
						mb="lg"
						{...form.getInputProps("email")}
					/>
					<TextInput
						label="Password"
						name="password"
						type="password"
						size="lg"
						key={form.key("password")}
						withAsterisk
						mb="lg"
						{...form.getInputProps("password")}
					/>

					<Button
						variant="filled"
						type="submit"
						size="lg"
						style={{ float: "right" }}
					>
						Login
					</Button>
				</form>
			</Box>
		</Group>
	);
};

export default LoginPage;

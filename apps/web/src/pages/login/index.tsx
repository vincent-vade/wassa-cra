import {
	Button,
	Container,
	Group,
	Paper,
	PasswordInput,
	Stack,
	TextInput,
	Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";

import { useAuth } from "~/context/AuthContext";

const LoginPage = () => {
	const form = useForm({
		initialValues: {
			email: "",
			password: "",
		},
		validateInputOnBlur: true,
		validate: {
			email: (value: string) =>
				!/^\S+@\S+$/.test(value) ? "Invalid email" : null,
			password: (val: string) =>
				val.length <= 6
					? "Password should include at least 6 characters"
					: null,
		},
	});

	const auth = useAuth();

	return (
		<Container mt="25vh" size={480}>
			<Paper radius="md" p="xl" withBorder shadow="sm">
				<Title order={3} mb="lg">
					Se connecter à Wassa CRA
				</Title>

				<form
					onSubmit={form.onSubmit((values) => {
						auth?.login(values.email, values.password);
					})}
				>
					<Stack>
						<TextInput
							label="Email"
							name="email"
							key={form.key("email")}
							withAsterisk
							size="md"
							color="base"
							variant="filled"
							{...form.getInputProps("email")}
						/>
						<PasswordInput
							label="Password"
							name="password"
							key={form.key("password")}
							withAsterisk
							size="md"
							variant="filled"
							{...form.getInputProps("password")}
						/>
					</Stack>
					<Group justify="space-between" mt="xl">
						<Button
							component={Link}
							href="/reset-password"
							variant="transparent"
						>
							Mot de passe oublié ?
						</Button>
						<Button variant="filled" type="submit" size="md">
							Se connecter
						</Button>
					</Group>
				</form>
			</Paper>
		</Container>
	);
};

export default LoginPage;

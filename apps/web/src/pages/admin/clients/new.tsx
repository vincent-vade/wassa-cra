import { Container, Paper, Title } from "@mantine/core";

import { FormClient } from "~/components/Form/Client";
import { Layout } from "~/components/layout";

export default function CreateClientPage() {
	return (
		<Layout>
			<Container size="xs">
				<Paper radius="md" p="xl" withBorder>
					<Title order={2}>Create a Client</Title>
					<FormClient />
				</Paper>
			</Container>
		</Layout>
	);
}

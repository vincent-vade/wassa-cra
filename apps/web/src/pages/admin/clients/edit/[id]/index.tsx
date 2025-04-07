import { Container, Paper, Title } from "@mantine/core";
import type { GetServerSidePropsContext } from "next";

import { FormClient } from "~/components/Form/Client";
import { Layout } from "~/components/layout";
import type { Client } from "~/lib/client";
import { getClientById } from "~/services/clients";

type ClientDetailsPageProps = {
	client: Client;
};

export default function ClientDetailsPage({ client }: ClientDetailsPageProps) {
	return (
		<Layout>
			<Container size="xs">
				<Paper radius="md" p="xl" withBorder>
					<Title order={2}>Edit Client {client?.name}</Title>
					<FormClient client={client} />
				</Paper>
			</Container>
		</Layout>
	);
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	return {
		props: {
			client: await getClientById(ctx.params?.id as string),
		},
	};
}

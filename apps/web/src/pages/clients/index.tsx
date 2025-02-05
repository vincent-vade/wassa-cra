import { type Client } from "~/lib/client";
import { getClients } from "~/services/clients";

export default function Clients({ clients }: { clients: Client[] }) {
	return (
		<>
			<h1>Clients</h1>
			{clients?.map((client) => (
				<li key={client?.id}>
					<a href={`/clients/${client?.id}`}>{client?.name}</a>
				</li>
			))}
		</>
	);
}

export async function getServerSideProps() {
	return {
		props: {
			clients: await getClients(),
		},
	};
}

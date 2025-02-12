import dayjs from "dayjs";
import { Layout } from "~/components/layout";
import type { Client } from "~/lib/client";
import { getClients } from "~/services/clients";

export default function Clients({ clients }: { clients: Client[] }) {
	return (
		<Layout>
			<h1>Clients</h1>
			<table>
				<thead>
					<tr>
						<th width={"260px"}>Id</th>
						<th>Name</th>
						<th>Email</th>
						<th>Phone</th>
						<th>Created at</th>
						<th>Updated at</th>
					</tr>
				</thead>
				<tbody>
					{clients?.map((client) => (
						<tr key={client?.id}>
							<td>{client?.id}</td>
							<td>{client?.name}</td>
							<td>{client?.email}</td>
							<td>{client?.phone}</td>
							<td>{dayjs(client.created_at).format("DD-MM-YYYY")}</td>
							<td>
								{client.updated_at &&
									dayjs(client.updated_at).format("DD-MM-YYYY")}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</Layout>
	);
}

export async function getServerSideProps() {
	return {
		props: {
			clients: await getClients(),
		},
	};
}

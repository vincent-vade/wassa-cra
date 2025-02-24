import { Button, Group } from "@mantine/core";
import dayjs from "dayjs";
import Link from "next/link";

import type { Column } from "~/components/DataTable";
import { Resources } from "~/components/Resources";
import { useAuth } from "~/context/AuthContext";
import type { Client } from "~/lib/client";
import { getClients } from "~/services/clients";

export const columns: Column<Client>[] = [
	{
		accessor: "id",
		Header: "ID",
	},
	{
		accessor: "email",
		Header: "Email",
	},
	{
		accessor: "name",
		Header: "Name",
	},
	{
		accessor: "phone",
		Header: "Name",
	},
	{
		accessor: "created_at",
		Header: "Created at",
		Row: ({ created_at }) => dayjs(created_at as string).format("DD-MM-YYYY"),
	},
	{
		accessor: "updated_at",
		Header: "Updated at",
		Row: ({ updated_at }) => {
			return updated_at
				? dayjs(updated_at as string).format("DD-MM-YYYY")
				: null;
		},
	},
	{
		accessor: "actions",
		Header: "Actions",
		Row: (data) => (
			<Group>
				<Button
					variant="transparent"
					component={Link}
					href={`/admin/clients/${data.id}`}
				>
					Edit
				</Button>
				<Button variant="filled" color="red">
					Delete
				</Button>
			</Group>
		),
	},
];

export default function Clients({ clients }: { clients: Client[] }) {
	const auth = useAuth();
	console.log(auth?.user);

	const data = clients?.map((client) => ({
		id: client?.id as string,
		name: client?.name,
		email: client?.email,
		phone: client?.phone,
		created_at: client?.created_at,
		updated_at: client?.updated_at,
	}));

	return <Resources title="Clients" columns={columns} data={data} />;
}

export async function getServerSideProps() {
	return {
		props: {
			clients: await getClients(),
		},
	};
}

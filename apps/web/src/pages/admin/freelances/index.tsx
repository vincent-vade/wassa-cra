import { Button, Group, NumberFormatter } from "@mantine/core";
import dayjs from "dayjs";
import Link from "next/link";
import type { Column } from "~/components/DataTable";
import { Resources } from "~/components/Resources";
import type { Freelance } from "~/lib/client";
import { getFreelances } from "~/services/freelances";

export const columns: Column<Freelance>[] = [
	{
		accessor: "id",
		Header: "Id",
	},
	{
		accessor: "email",
		Header: "Email",
	},
	{
		accessor: "daily_rate",
		Header: "Daily rate",
		Row: ({ daily_rate }) => (
			<NumberFormatter
				prefix="€ "
				value={daily_rate as number}
				thousandSeparator
			/>
		),
	},
	{
		accessor: "created_at",
		Header: "Created at",
		Row: ({ created_at }) => dayjs(created_at as string).format("DD-MM-YYYY"),
	},
	{
		accessor: "updated_at",
		Header: "Updated at",
		Row: ({ updated_at }) =>
			updated_at ? dayjs(updated_at as string).format("DD-MM-YYYY") : null,
	},
	{
		accessor: "actions",
		Header: "Actions",
		Row: (data) => (
			<Group>
				<Button
					variant="transparent"
					component={Link}
					href={`/admin/freelances/${data.id}`}
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

export default function Freelances({
	freelances,
}: { freelances: Freelance[] }) {
	const data = freelances?.map((freelance) => ({
		id: freelance?.id as string,
		email: freelance?.email,
		daily_rate: freelance?.daily_rate,
		created_at: freelance?.created_at,
		updated_at: freelance?.updated_at,
	}));

	return <Resources title="Freelances" columns={columns} data={data} />;
}

export async function getServerSideProps() {
	return {
		props: {
			freelances: await getFreelances(),
		},
	};
}

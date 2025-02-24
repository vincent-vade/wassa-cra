import { Resources } from "~/components/Resources";
import type { Project } from "~/lib/client";
import { getProjects } from "~/services/projects";

import { Button, Chip, Group } from "@mantine/core";
import dayjs from "dayjs";
import Link from "next/link";
import type { Column } from "~/components/DataTable";

export const columns: Column<Project>[] = [
	{
		accessor: "id",
		Header: () => "Id",
	},
	{
		accessor: "name",
		Header: "Project name",
	},
	{
		accessor: "created_at",
		Header: "Created at",
		Row: ({ created_at }) => {
			return dayjs(created_at as string).format("DD-MM-YYYY");
		},
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
		accessor: "is_active",
		Header: "Is active",
		Row: (data) => {
			return (
				<Chip checked={data.is_active} color={data.is_active ? "green" : "red"}>
					OK
				</Chip>
			);
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
					href={`/admin/projects/${data.id}`}
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

export default function Projects({ projects }: { projects: Project[] }) {
	const data = projects?.map((project) => ({
		id: project?.id as string,
		name: project?.name,
		created_at: project?.created_at,
		updated_at: project?.updated_at,
		is_active: project?.is_active,
	}));

	return <Resources title="Projects" columns={columns} data={data} />;
}

export async function getServerSideProps() {
	return {
		props: {
			projects: await getProjects(),
		},
	};
}

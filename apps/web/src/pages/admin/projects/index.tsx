import { Button, Chip, Group } from '@mantine/core';
import dayjs from 'dayjs';
import Link from 'next/link';
import { type NextRouter, useRouter } from 'next/router';

import { Resources } from '~/components/Resources';
import type { Project } from '~/lib/client';
import { deleteProjectById, getProjects } from '~/services/projects';

import type { Column } from '~/components/DataTable';
import { deleteModal } from '~/components/DeleteModal';

const columns: (router: NextRouter) => Column<Project>[] = (router) => [
	{
		accessor: 'id',
		Header: () => 'Id',
	},
	{
		accessor: 'name',
		Header: 'Project name',
	},
	{
		accessor: 'created_at',
		Header: 'Created at',
		Row: ({ created_at }) => {
			return dayjs(created_at as string).format('DD-MM-YYYY');
		},
	},
	{
		accessor: 'updated_at',
		Header: 'Updated at',
		Row: ({ updated_at }) => {
			return updated_at
				? dayjs(updated_at as string).format('DD-MM-YYYY')
				: null;
		},
	},
	{
		accessor: 'is_active',
		Header: 'Is active',
		Row: (data) => {
			return (
				<Chip checked={data.is_active} color={data.is_active ? 'green' : 'red'}>
					OK
				</Chip>
			);
		},
	},
	{
		accessor: 'actions',
		Header: 'Actions',
		Row: (data) => (
			<Group>
				<Button
					variant="transparent"
					component={Link}
					href={`/admin/projects/${data.id}`}
				>
					Edit
				</Button>
				<Button
					variant="filled"
					color="red"
					onClick={() =>
						deleteModal({
							title: `Delete project ${data.name}`,
							onConfirm: async () => {
								await deleteProjectById(data.id);
								await router.push('/admin/projects');
							},
						})
					}
				>
					Delete
				</Button>
			</Group>
		),
	},
];

export default function Projects({ projects }: { projects: Project[] }) {
	const router = useRouter();

	const data = projects?.map((project) => ({
		id: project?.id as string,
		name: project?.name,
		created_at: project?.created_at,
		updated_at: project?.updated_at,
		is_active: project?.is_active,
	}));

	return <Resources title="Projects" columns={columns(router)} data={data} />;
}

export async function getServerSideProps() {
	return {
		props: {
			projects: await getProjects(),
		},
	};
}

import { type Project, client } from '~/lib/client';

export const getProjects = async () => {
	const { data } = await client.GET('/api/rest/projects');
	return data?.projects as Project[];
};

export const getProjectById = async (id: string) => {
	const { data } = await client.GET('/api/rest/projects/{id}', {
		params: {
			path: {
				id,
			},
		},
	});

	return data?.projects_by_pk as Project;
};

export const deleteProjectById = async (id: string) => {
	const { data } = await client.DELETE('/api/rest/projects/{id}', {
		params: {
			path: {
				id,
			},
		},
	});

	return data?.delete_projects_by_pk as Project;
};

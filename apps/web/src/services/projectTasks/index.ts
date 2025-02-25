import { type ProjectTasks, type ProjetTask, client } from "~/lib/client";

export const getProjectTasks = async () => {
	const { data } = await client.GET("/api/rest/projects_tasks");
	return data?.projects_tasks as ProjectTasks;
};

export const getProjectTasksByProjectId = async (projectId: string) => {
	const { data } = await client.GET(
		"/api/rest/projects-tasks/project/{projectId}",
		{
			params: {
				path: {
					projectId,
				},
			},
		},
	);
	return data?.projects_tasks as ProjectTasks;
};

export const getProjectTasksById = async (id: string) => {
	const { data } = await client.GET("/api/rest/projects_tasks/{id}", {
		params: {
			path: {
				id,
			},
		},
	});
	return data?.projects_tasks_by_pk as ProjetTask;
};

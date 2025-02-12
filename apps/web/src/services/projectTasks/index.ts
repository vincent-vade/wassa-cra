import {client, ProjectTasks, ProjetTask} from "~/lib/client";

export const getProjectTasks = async () => {
    const { data } = await client.GET("/api/rest/projects_tasks");
    return data?.projects_tasks as ProjectTasks;
};

export const getProjectTasksByProjectId = async (projectId: string) => {
    const { data } = await client.GET(`/api/rest/projects-tasks/project/${projectId}`);
    return data?.projects_tasks as ProjectTasks;
};

export const getProjectById = async (id: string) => {
    const { data } = await client.GET(`/api/rest/projects_tasks/${id}`);
    return data?.projects_tasks as ProjetTask;
};